"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getCurrentProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      startupProfile: true,
      _count: {
        select: { followers: true, following: true }
      }
    }
  });

  return user;
}

export async function updateProfile(data: {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  industry?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      bio: data.bio,
      location: data.location,
      profile: {
        upsert: {
          create: {
            bio: data.bio,
            location: data.location,
            website: data.website,
            industry: data.industry,
          },
          update: {
            bio: data.bio,
            location: data.location,
            website: data.website,
            industry: data.industry,
          }
        }
      }
    }
  });

  return { success: true };
}
