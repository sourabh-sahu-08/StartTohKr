"use server";

import { PrismaClient, OpportunityStatus } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getOpportunities() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.innovationOpportunity.findMany({
    where: {
      OR: [
        { requesterId: session.user.id },
        { innovation: { startupId: session.user.id } }
      ]
    },
    include: {
      requester: { select: { name: true, image: true, role: true } },
      innovation: { select: { title: true, startup: { select: { name: true, ownerId: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateOpportunityStatus(id: string, status: OpportunityStatus) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const opp = await prisma.innovationOpportunity.update({
    where: { id },
    data: { status }
  });

  // Notify the requester
  await prisma.notification.create({
    data: {
      recipientId: opp.requesterId,
      type: "OPPORTUNITY",
      title: `Opportunity ${status}`,
      body: `Your opportunity request was ${status.toLowerCase()}`,
      link: '/opportunities',
      read: false
    }
  });

  return opp;
}
