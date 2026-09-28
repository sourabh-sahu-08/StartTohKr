import { getScalingHubInnovationsAction } from "@/backend/actions/scaling.action";

export const scalingApi = {
  async getScalingHubInnovations() {
    const response = await getScalingHubInnovationsAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch scaling innovations");
    return response.data;
  }
};
