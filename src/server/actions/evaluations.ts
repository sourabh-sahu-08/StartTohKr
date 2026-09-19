"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getApplicationsForEvaluation() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // For demo: evaluators see all SHORTLISTED applications
  return prisma.application.findMany({
    where: { status: 'SHORTLISTED' },
    include: {
      challenge: true,
      startup: { select: { name: true } },
      innovation: { select: { title: true, problem: true, solution: true } },
      evaluations: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getEvaluationsByMe() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.evaluation.findMany({
    where: { evaluatorId: session.user.id },
    include: {
      application: {
        include: {
          challenge: true,
          startup: { select: { name: true } }
        }
      }
    }
  });
}

export async function submitEvaluation(applicationId: string, score: number, feedback: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.evaluation.findFirst({
    where: { applicationId, evaluatorId: session.user.id }
  });

  if (existing) throw new Error("You have already evaluated this application");

  return prisma.evaluation.create({
    data: {
      applicationId,
      evaluatorId: session.user.id,
      scores: [score],
      totalScore: score,
      feedback
    }
  });
}

export async function updateApplicationStatus(id: string, status: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.application.update({
    where: { id },
    data: { status }
  });
}

export async function getGovernmentApplications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Gov sees applications to their challenges
  return prisma.application.findMany({
    where: { challenge: { department: session.user.name || "" } },
    include: {
      challenge: true,
      startup: { select: { name: true } },
      innovation: true,
      evaluations: true
    },
    orderBy: { createdAt: 'desc' }
  });
}
