"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getMentorshipCandidates() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

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
}

export async function getMyMentorships() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.innovationOpportunity.findMany({
    where: {
      requesterId: session.user.id,
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
