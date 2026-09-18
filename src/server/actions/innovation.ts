"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getInnovationDetails(id: string) {
  const innovation = await prisma.innovation.findUnique({
    where: { id },
    include: {
      startup: {
        select: { id: true, name: true, image: true, startupProfile: true }
      },
      posts: {
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          signals: true,
          comments: {
            include: { user: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      milestones: true,
      opportunities: true,
    }
  });

  return innovation;
}

export async function getSimilarInnovations(category: string, excludeId: string) {
  return prisma.innovation.findMany({
    where: {
      category,
      id: { not: excludeId }
    },
    take: 3,
    include: {
      startup: { select: { name: true } }
    }
  });
}
