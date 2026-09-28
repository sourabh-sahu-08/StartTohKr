"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MentorService } from "../services/mentor.service";
import { ApiResponse } from "@/shared/types/api.types";

export async function getMentorshipCandidatesAction(): Promise<ApiResponse<any[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await MentorService.fetchMentorshipCandidates();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function getMyMentorshipsAction(): Promise<ApiResponse<any[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await MentorService.fetchMyMentorships(session.user.id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
