"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getScalingHubInnovations() {
  // Innovations that have a completed pilot or are "PROVEN" stage
  return prisma.innovation.findMany({
    where: {
      OR: [
        { stage: "PROVEN" },
        { pilots: { some: { status: "COMPLETED" } } }
      ]
    },
    include: {
      startup: { select: { name: true, logo: true, industry: true } },
      pilots: {
        where: { status: "COMPLETED" },
        select: { governmentDept: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}
