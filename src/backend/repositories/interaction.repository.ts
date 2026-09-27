import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const InteractionRepository = {
  async findTracker(userId: string, innovationId: string) {
    return prisma.innovationTracker.findUnique({
      where: {
        userId_innovationId: { userId, innovationId }
      }
    });
  },

  async deleteTracker(id: string) {
    return prisma.innovationTracker.delete({ where: { id } });
  },

  async createTracker(userId: string, innovationId: string) {
    return prisma.innovationTracker.create({
      data: { userId, innovationId }
    });
  },

  async findSavedItem(userId: string, entityType: string, entityId: string) {
    return prisma.savedItem.findUnique({
      where: {
        userId_entityType_entityId: { userId, entityType, entityId }
      }
    });
  },

  async deleteSavedItem(id: string) {
    return prisma.savedItem.delete({ where: { id } });
  },

  async createSavedItem(userId: string, entityType: string, entityId: string) {
    return prisma.savedItem.create({
      data: { userId, entityType, entityId }
    });
  },

  async createOpportunity(data: {
    requesterId: string;
    innovationId: string;
    type: any;
    message: string;
  }) {
    return prisma.innovationOpportunity.create({
      data
    });
  }
};
