"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getConversations() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Fetch all users we have messages with
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id }
      ]
    },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
      receiver: { select: { id: true, name: true, image: true, role: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Group by conversation partner
  const conversationsMap = new Map();

  for (const m of messages) {
    const partnerId = m.senderId === session.user.id ? m.receiverId : m.senderId;
    const partner = m.senderId === session.user.id ? m.receiver : m.sender;
    
    if (!conversationsMap.has(partnerId)) {
      conversationsMap.set(partnerId, {
        partner,
        lastMessage: m.content,
        updatedAt: m.createdAt,
        messages: []
      });
    }
    conversationsMap.get(partnerId).messages.unshift(m); // older first
  }

  return Array.from(conversationsMap.values());
}

export async function sendMessage(receiverId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  
  let conversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: { id: { in: [session.user.id, receiverId] } }
      }
    }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participants: { connect: [{ id: session.user.id }, { id: receiverId }] }
      }
    });
  }

  const msg = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      content,
      conversationId: conversation.id
    },

    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
      receiver: { select: { id: true, name: true, image: true, role: true } }
    }
  });

  // Also create a notification for the receiver
  await prisma.notification.create({
    data: {
      recipientId: receiverId,
      type: "MESSAGE",
      title: `New message from ${msg.sender.name}`,
      body: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      link: '/messages',
      read: false
    }
  });

  return msg;
}
