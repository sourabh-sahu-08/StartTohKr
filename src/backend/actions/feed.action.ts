"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { FeedService } from "../services/feed.service";
import { FeedFilters } from "../repositories/feed.repository";
import { ApiResponse } from "@/shared/types/api.types";

export async function getFeedPostsAction(filters: FeedFilters): Promise<ApiResponse<any>> {
  try {
    const posts = await FeedService.fetchFeed(filters);
    return { success: true, data: posts };
  } catch (error: any) {
    console.error("getFeedPostsAction error:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function createInnovationPostAction(data: {
  content: string;
  innovationId: string;
  type: string;
}): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const post = await FeedService.publishPost(data, session.user.id);
    return { success: true, data: post };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function toggleSignalAction(postId: string, type: string): Promise<ApiResponse<{ action: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const result = await FeedService.toggleSignal(postId, type, session.user.id);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
