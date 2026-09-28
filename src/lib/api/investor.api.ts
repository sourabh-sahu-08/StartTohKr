import {
  getPromisingInnovationsAction,
  getMyInvestmentsAction
} from "@/backend/actions/investor.action";

export const investorApi = {
  async getPromisingInnovations() {
    const response = await getPromisingInnovationsAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch promising innovations");
    return response.data;
  },

  async getMyInvestments() {
    const response = await getMyInvestmentsAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch your investments");
    return response.data;
  }
};
