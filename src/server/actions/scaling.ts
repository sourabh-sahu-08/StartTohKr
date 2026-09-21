"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getScalingHubInnovations() {
  // Innovations that have a completed pilot or are "SCALING" stage
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
