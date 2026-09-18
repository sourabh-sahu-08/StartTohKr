"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getSavedItems() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const saves = await prisma.savedItem.findMany({
    where: { userId: session.user.id, entityType: 'INNOVATION' },
    orderBy: { createdAt: 'desc' }
  });

  if (saves.length === 0) return [];

  const innovationIds = saves.map(s => s.entityId);

  return prisma.innovation.findMany({
    where: { id: { in: innovationIds } },
    include: {
      startup: { select: { name: true } }
    }
  });
}

export async function getTrackedItems() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const trackers = await prisma.innovationTracker.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  if (trackers.length === 0) return [];

  const innovationIds = trackers.map(t => t.innovationId);

  return prisma.innovation.findMany({
    where: { id: { in: innovationIds } },
    include: {
      startup: { select: { name: true } }
    }
  });
}
