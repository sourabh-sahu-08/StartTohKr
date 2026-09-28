import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const MentorRepository = {
  async getMentorshipCandidates() {
    return prisma.innovation.findMany({
      where: {
        OR: [
          { stage: "IDEA" },
          { stage: "PROTOTYPE" },
          { stage: "MVP" }
        ]
      },
      include: {
        startup: { select: { name: true, image: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 12
    });
  },

  async getMentorshipsByUserId(userId: string) {
    return prisma.innovationOpportunity.findMany({
      where: {
        requesterId: userId,
        type: "MENTORSHIP"
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
