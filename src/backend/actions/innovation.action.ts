"use server";

import { InnovationService } from "../services/innovation.service";
import { ApiResponse } from "@/shared/types/api.types";

export async function getInnovationDetailsAction(id: string): Promise<ApiResponse<any>> {
  try {
    const data = await InnovationService.fetchInnovationDetails(id);
    return { success: true, data };
  } catch (error: any) {
    console.error("getInnovationDetailsAction error:", error);
    return { success: false, error: { code: "NOT_FOUND", message: error.message } };
  }
}

export async function getSimilarInnovationsAction(category: string, excludeId: string): Promise<ApiResponse<any>> {
  try {
    const data = await InnovationService.fetchSimilarInnovations(category, excludeId);
    return { success: true, data };
  } catch (error: any) {
    console.error("getSimilarInnovationsAction error:", error);
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
