"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PilotService } from "../services/pilot.service";
import { ApiResponse } from "@/shared/types/api.types";

export async function getPilotsAction(): Promise<ApiResponse<any[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await PilotService.fetchPilotsForUser(session.user.id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function createPilotTaskAction(pilotId: string, title: string): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await PilotService.createTask(pilotId, title);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function updatePilotTaskStatusAction(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await PilotService.updateTaskStatus(taskId, status);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
