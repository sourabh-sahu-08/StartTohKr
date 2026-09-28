"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllInnovationsCompact() {
  return prisma.innovation.findMany({
    select: {
      id: true,
      title: true,
      tagline: true,
      category: true,
      stage: true,
      
      timeline: true,
      momentumScore: true,
      startup: { select: { name: true } }
    },
    orderBy: { momentumScore: 'desc' }
  });
}
