import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const NotificationRepository = {
  async getByUserId(userId: string) {
    return prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async markAsRead(id: string, userId: string) {
    return prisma.notification.update({
      where: { id, recipientId: userId },
      data: { read: true }
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { recipientId: userId, read: false },
      data: { read: true }
    });
  },

  async create(data: {
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
