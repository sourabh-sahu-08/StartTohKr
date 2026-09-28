"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getFeedPosts(params: {
  search?: string;
  discoveryMode?: string;
  filters?: {
    industry?: string[];
    stage?: string[];
    tech?: string[];
    opps?: string[];
  };
}) {
  const { search, discoveryMode = 'MOMENTUM', filters } = params;

  // Build the innovation where clause
  let innovationWhere: Prisma.InnovationWhereInput = {};
  
  if (search?.trim()) {
    const s = search.toLowerCase();
    innovationWhere.OR = [
      { title: { contains: s, mode: 'insensitive' } },
      { problem: { contains: s, mode: 'insensitive' } },
      { category: { contains: s, mode: 'insensitive' } },
    ];
  }

  if (filters?.industry?.length) {
    innovationWhere.category = { in: filters.industry };
  }

  if (filters?.stage?.length) {
    // Need to cast the string back to enum Stage
    innovationWhere.stage = { in: filters.stage as any[] };
  }

  switch (discoveryMode) {
    case 'EARLY_IDEAS':
      innovationWhere.stage = { in: ['IDEA', 'PROTOTYPE'] };
      break;
    case 'BUILDING':
      innovationWhere.stage = { in: ['PROTOTYPE', 'MVP'] };
      break;
    case 'READY_TO_PILOT':
      innovationWhere.stage = { in: ['MVP', 'PILOT'] };
      break;
    case 'SCALING':
      innovationWhere.stage = 'SCALING';
      break;
  }

  let orderBy: Prisma.InnovationPostOrderByWithRelationInput | Prisma.InnovationPostOrderByWithRelationInput[] = { createdAt: 'desc' };

  if (discoveryMode === 'MOMENTUM') {
    // Order by momentum score of the innovation
    orderBy = { innovation: { momentumScore: 'desc' } };
  } else if (discoveryMode === 'MATCHED') {
    // Basic fallback for sorting if matched
    orderBy = [
      { innovation: { category: 'desc' } }, // Simple mock logic for 'MATCHED'
      { createdAt: 'desc' }
    ];
  }

  const posts = await prisma.innovationPost.findMany({
    where: {
      innovation: innovationWhere,
    },
    orderBy,
    take: 50,
    include: {
      author: {
        select: { id: true, name: true, image: true, role: true }
      },
      innovation: {
        include: {
          startup: {
            select: { id: true, name: true, startupProfile: true }
          },
          _count: {
            select: { signals: true, trackers: true, comments: true }
          }
        }
      },
      signals: true,
      comments: {
        include: { user: true }
      }
    }
  });

  return posts;
}

export async function createInnovationPost(data: {
  content: string;
  innovationId: string;
  type: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const post = await prisma.innovationPost.create({
    data: {
      content: { text: data.content },
      type: data.type as any,
      innovationId: data.innovationId,
      authorId: session.user.id
    }
  });

  return post;
}

export async function toggleSignal(postId: string, type: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.innovationSignal.findFirst({
    where: { userId: session.user.id, postId }
  });

  if (existing) {
    if (existing.type === type) {
      await prisma.innovationSignal.delete({ where: { id: existing.id } });
      return { action: 'removed' };
    } else {
      await prisma.innovationSignal.update({
        where: { id: existing.id },
        data: { type: type as any }
      });
      return { action: 'updated' };
    }
  } else {
    await prisma.innovationSignal.create({
      data: {
        userId: session.user.id,
        postId,
        type: type as any
      }
    });
    // Boost momentum
    const post = await prisma.innovationPost.findUnique({ where: { id: postId }});
    if (post?.innovationId) {
      await prisma.innovation.update({
        where: { id: post.innovationId },
        data: { momentumScore: { increment: 5 } }
      });
    }
    return { action: 'added' };
  }
}
