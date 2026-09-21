"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getPromisingInnovations() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.innovation.findMany({
    where: {
      OR: [
        { stage: "EARLY_TRACTION" },
        { stage: "SCALING" }
      ]
    },
    include: {
      startup: { select: { name: true, industry: true, location: true } }
    },
    orderBy: { momentumScore: 'desc' },
    take: 10
  });
}

export async function getMyInvestments() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.innovationOpportunity.findMany({
    where: {
      requesterId: session.user.id,
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
