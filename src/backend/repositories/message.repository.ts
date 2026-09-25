import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const MessageRepository = {
  async getMessagesByUserId(userId: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: { select: { id: true, name: true, image: true, role: true } },
        receiver: { select: { id: true, name: true, image: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findConversation(userId1: string, userId2: string) {
    return prisma.conversation.findFirst({
      where: {
        participants: {
          every: { id: { in: [userId1, userId2] } }
        }
      }
    });
  },

  async createConversation(userId1: string, userId2: string) {
    return prisma.conversation.create({
      data: {
        participants: { connect: [{ id: userId1 }, { id: userId2 }] }
      }
    });
  },

  async createMessage(senderId: string, receiverId: string, content: string, conversationId: string) {
    return prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        conversationId
      },
      include: {
        sender: { select: { id: true, name: true, image: true, role: true } },
        receiver: { select: { id: true, name: true, image: true, role: true } }
      }
    });
  },

  async createNotification(data: {
    recipientId: string;
    type: any;
    title: string;
    body: string;
    relatedEntity: string;
    read: boolean;
  }) {
    return prisma.notification.create({
      data
    });
  }
};
