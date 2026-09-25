import { PrismaClient, OpportunityStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const OpportunityRepository = {
  async getByUserId(userId: string) {
    return prisma.innovationOpportunity.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { innovation: { startupId: userId } }
        ]
      },
      include: {
        requester: { select: { name: true, image: true, role: true } },
        innovation: { select: { title: true, startup: { select: { name: true, id: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async updateStatus(id: string, status: OpportunityStatus) {
    return prisma.innovationOpportunity.update({
      where: { id },
      data: { status }
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
