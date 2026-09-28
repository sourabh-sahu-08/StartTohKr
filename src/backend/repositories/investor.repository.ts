import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const InvestorRepository = {
  async getPromisingInnovations() {
    return prisma.innovation.findMany({
      where: {
        OR: [
          { stage: "MVP" },
          { stage: "SCALING" }
        ]
      },
      include: {
        startup: { select: { name: true, image: true } }
      },
      orderBy: { momentumScore: 'desc' },
      take: 10
    });
  },

  async getInvestmentsByUserId(userId: string) {
    return prisma.innovationOpportunity.findMany({
      where: {
        requesterId: userId,
        type: "INVESTMENT"
      },
      include: {
        innovation: {
          select: {
            title: true,
            startup: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
