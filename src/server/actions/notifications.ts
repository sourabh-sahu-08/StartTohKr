"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.notification.findMany({
    where: { recipientId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function markNotificationAsRead(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.notification.update({
    where: { id, recipientId: session.user.id },
    data: { read: true }
  });
}

export async function markAllNotificationsAsRead() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.notification.updateMany({
    where: { recipientId: session.user.id, read: false },
    data: { read: true }
  });
}

export async function createSystemNotification(recipientId: string, title: string, body: string, link: string) {
  return prisma.notification.create({
    data: {
      recipientId,
      title,
      message,
      link,
      read: false
    }
  });
}
