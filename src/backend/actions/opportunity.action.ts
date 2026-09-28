"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { OpportunityService } from "../services/opportunity.service";
import { ApiResponse } from "@/shared/types/api.types";
import { OpportunityStatus } from "@prisma/client";

export async function getOpportunitiesAction(): Promise<ApiResponse<any[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await OpportunityService.fetchOpportunities(session.user.id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function updateOpportunityStatusAction(id: string, status: OpportunityStatus): Promise<ApiResponse<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await OpportunityService.updateStatus(id, status);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
