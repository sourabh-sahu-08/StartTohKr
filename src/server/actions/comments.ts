"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function addComment(data: {
  postId?: string;
  innovationId: string;
  content: string;
  category: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const comment = await prisma.innovationComment.create({
    data: {
      content: data.content,
      category: data.category as any,
      postId: data.postId,
      innovationId: data.innovationId,
      userId: session.user.id
    }
  });

  return comment;
}
