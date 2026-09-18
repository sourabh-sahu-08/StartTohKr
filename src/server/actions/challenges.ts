"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getChallenges() {
  return prisma.challenge.findMany({
    include: {
      applications: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getChallenge(id: string) {
  return prisma.challenge.findUnique({
    where: { id },
    include: {
      applications: {
        include: { startup: true, innovation: true }
      }
    }
  });
}

export async function createChallenge(data: {
  title: string;
  department: string;
  description: string;
  category: string;
  budget: string;
  deadline: Date;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const challenge = await prisma.challenge.create({
    data: {
      title: data.title,
      department: data.department,
      description: data.description,
      category: data.category,
      budget: data.budget,
      deadline: data.deadline,
      status: 'OPEN'
    }
  });
  return challenge;
}

export async function submitApplication(challengeId: string, innovationId: string, pitch: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const startup = await prisma.startup.findUnique({ where: { ownerId: session.user.id } });
  if (!startup) throw new Error("No startup profile found");

  const application = await prisma.application.create({
    data: {
      challengeId,
      innovationId,
      startupId: startup.id,
      pitch,
      status: 'SUBMITTED'
    }
  });
  return application;
}
