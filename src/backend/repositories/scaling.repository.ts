import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ScalingRepository = {
  async getScalingInnovations() {
    return prisma.innovation.findMany({
      where: {
        OR: [
          { stage: "SCALING" },
          { pilots: { some: { status: "COMPLETED" } } }
        ]
      },
      include: {
        startup: { select: { name: true, image: true } },
        pilots: {
          where: { status: "COMPLETED" },
          select: { governmentDept: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
