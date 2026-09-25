import {
  getOpportunitiesAction,
  updateOpportunityStatusAction
} from "@/backend/actions/opportunity.action";
import { OpportunityStatus } from "@prisma/client";

export const opportunityApi = {
  async getAll() {
    const response = await getOpportunitiesAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch opportunities");
    return response.data;
  },

  async updateStatus(id: string, status: OpportunityStatus) {
    const response = await updateOpportunityStatusAction(id, status);
    if (!response.success) throw new Error(response.error?.message || "Failed to update opportunity status");
    return response.data;
  }
};
