"use server";

import { ScalingService } from "../services/scaling.service";
import { ApiResponse } from "@/shared/types/api.types";

export async function getScalingHubInnovationsAction(): Promise<ApiResponse<any[]>> {
  try {
    const data = await ScalingService.fetchScalingHubInnovations();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
