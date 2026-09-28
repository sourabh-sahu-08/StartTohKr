import { getInnovationDetailsAction, getSimilarInnovationsAction } from "@/backend/actions/innovation.action";

export const innovationApi = {
  async getById(id: string) {
    const response = await getInnovationDetailsAction(id);
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch innovation");
    return response.data;
  },

  async getSimilar(category: string, excludeId: string) {
    const response = await getSimilarInnovationsAction(category, excludeId);
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch similar innovations");
    return response.data;
  }
};
