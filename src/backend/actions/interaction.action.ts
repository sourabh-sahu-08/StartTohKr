"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { InteractionService } from "../services/interaction.service";
import { ApiResponse } from "@/shared/types/api.types";

export async function toggleTrackAction(innovationId: string): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await InteractionService.toggleTrack(session.user.id, innovationId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function toggleSaveAction(entityType: string, entityId: string): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await InteractionService.toggleSave(session.user.id, entityType, entityId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function sendOpportunityAction(data: { innovationId: string, type: string, message: string }): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const opp = await InteractionService.sendOpportunity(session.user.id, data.innovationId, data.type, data.message);
    return { success: true, data: opp };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
