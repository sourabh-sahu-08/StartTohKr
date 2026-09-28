"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getStartupDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const myInnovations = await prisma.innovation.findMany({
    where: { startupId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  const myApplications = await prisma.application.findMany({
    where: { startupId: session.user.id },
    include: {
      challenge: true,
      innovation: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return { myInnovations, myApplications };
}
