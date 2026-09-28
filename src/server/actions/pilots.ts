"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getPilots() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // If user is a STARTUP, get their pilots. If government, get pilots they manage.
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  if (user?.role === 'GOVERNMENT') {
    return prisma.pilot.findMany({
      where: { governmentDept: user.name || "" },
      include: {
        startup: { select: { name: true, ownerId: true } },
        innovation: { select: { title: true } },
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    // STARTUP
    const startup = await prisma.startup.findUnique({ where: { ownerId: session.user.id } });
    
    if (!startup) return [];

    return prisma.pilot.findMany({
      where: { startupId: startup.id },
      include: {
        startup: { select: { name: true, ownerId: true } },
        innovation: { select: { title: true } },
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export async function createPilotTask(pilotId: string, title: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.pilotTask.create({
    data: {
      pilotId,
      title
    }
  });
}

export async function updatePilotTaskStatus(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.pilotTask.update({
    where: { id: taskId },
    data: { status }
  });
}
