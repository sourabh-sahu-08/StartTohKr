"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ChallengeService } from "../services/challenge.service";
import { ApiResponse } from "@/shared/types/api.types";

export async function getChallengesAction(): Promise<ApiResponse<any[]>> {
  try {
    const data = await ChallengeService.fetchAll();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function getChallengeByIdAction(id: string): Promise<ApiResponse<any>> {
  try {
    const data = await ChallengeService.fetchById(id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "NOT_FOUND", message: error.message } };
  }
}

export async function createChallengeAction(data: {
  title: string;
  department: string;
  description: string;
  category: string;
  budget: string;
  deadline: Date;
}): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const challenge = await ChallengeService.createChallenge(data);
    return { success: true, data: challenge };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function submitApplicationAction(data: {
  challengeId: string;
  innovationId: string;
  pitch: string;
}): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const application = await ChallengeService.submitApplication(
      session.user.id,
      data.challengeId,
      data.innovationId,
      data.pitch
    );
    return { success: true, data: application };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
