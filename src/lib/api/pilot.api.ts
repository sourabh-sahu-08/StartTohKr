import {
  getPilotsAction,
  createPilotTaskAction,
  updatePilotTaskStatusAction
} from "@/backend/actions/pilot.action";

export const pilotApi = {
  async getAll() {
    const response = await getPilotsAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch pilots");
    return response.data;
  },

  async createTask(pilotId: string, title: string) {
    const response = await createPilotTaskAction(pilotId, title);
    if (!response.success) throw new Error(response.error?.message || "Failed to create task");
    return response.data;
  },

  async updateTaskStatus(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED') {
    const response = await updatePilotTaskStatusAction(taskId, status);
    if (!response.success) throw new Error(response.error?.message || "Failed to update task status");
    return response.data;
  }
};
