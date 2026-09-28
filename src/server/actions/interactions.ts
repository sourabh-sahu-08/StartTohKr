"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function toggleTrack(innovationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.innovationTracker.findUnique({
    where: {
      userId_innovationId: {
        userId: session.user.id,
        innovationId
      }
    }
  });

  if (existing) {
    await prisma.innovationTracker.delete({ where: { id: existing.id } });
    return { action: 'untracked' };
  } else {
    await prisma.innovationTracker.create({
      data: { userId: session.user.id, innovationId }
    });
    return { action: 'tracked' };
  }
}

export async function toggleSave(entityType: string, entityId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.savedItem.findUnique({
    where: {
      userId_entityType_entityId: {
        userId: session.user.id,
        entityType,
        entityId
      }
    }
  });

  if (existing) {
    await prisma.savedItem.delete({ where: { id: existing.id } });
    return { action: 'unsaved' };
  } else {
    await prisma.savedItem.create({
      data: { userId: session.user.id, entityType, entityId }
    });
    return { action: 'saved' };
  }
}

export async function sendOpportunity(data: {
  innovationId: string;
  type: string;
  message: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const opp = await prisma.innovationOpportunity.create({
    data: {
      requesterId: session.user.id,
      innovationId: data.innovationId,
      type: data.type as any,
      message: data.message,
    }
  });

  return opp;
}
