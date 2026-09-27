import {
  toggleTrackAction,
  toggleSaveAction,
  sendOpportunityAction
} from "@/backend/actions/interaction.action";

export const interactionApi = {
  async toggleTrack(innovationId: string) {
    const response = await toggleTrackAction(innovationId);
    if (!response.success) throw new Error(response.error?.message || "Failed to toggle track");
    return response.data;
  },

  async toggleSave(entityType: string, entityId: string) {
    const response = await toggleSaveAction(entityType, entityId);
    if (!response.success) throw new Error(response.error?.message || "Failed to toggle save");
    return response.data;
  },

  async sendOpportunity(data: { innovationId: string, type: string, message: string }) {
    const response = await sendOpportunityAction(data);
    if (!response.success) throw new Error(response.error?.message || "Failed to send opportunity");
    return response.data;
  }
};
