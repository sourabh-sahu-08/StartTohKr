"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { InvestorService } from "../services/investor.service";
import { ApiResponse } from "@/shared/types/api.types";

export async function getPromisingInnovationsAction(): Promise<ApiResponse<any[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await InvestorService.fetchPromisingInnovations();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}

export async function getMyInvestmentsAction(): Promise<ApiResponse<any[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } };

    const data = await InvestorService.fetchMyInvestments(session.user.id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { code: "INTERNAL_ERROR", message: error.message } };
  }
}
