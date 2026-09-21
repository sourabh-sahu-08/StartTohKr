"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getAdminDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // In a real app, verify user is ADMIN
  // const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  // if (user?.role !== 'ADMIN') throw new Error("Unauthorized");

  const totalUsers = await prisma.user.count();
  const totalInnovations = await prisma.innovation.count();
  const totalChallenges = await prisma.challenge.count();

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  return { totalUsers, totalInnovations, totalChallenges, recentUsers };
}

export async function updateUserRole(userId: string, role: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  return prisma.user.update({
    where: { id: userId },
    data: { role }
  });
}
