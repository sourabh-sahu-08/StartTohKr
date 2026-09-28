import {
  getNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  createSystemNotificationAction
} from "@/backend/actions/notification.action";

export const notificationApi = {
  async getAll() {
    const response = await getNotificationsAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to fetch notifications");
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await markNotificationAsReadAction(id);
    if (!response.success) throw new Error(response.error?.message || "Failed to mark as read");
    return response.data;
  },

  async markAllAsRead() {
    const response = await markAllNotificationsAsReadAction();
    if (!response.success) throw new Error(response.error?.message || "Failed to mark all as read");
    return response.data;
  },

  async createSystem(recipientId: string, title: string, body: string, relatedEntity: string) {
    const response = await createSystemNotificationAction(recipientId, title, body, relatedEntity);
    if (!response.success) throw new Error(response.error?.message || "Failed to create system notification");
    return response.data;
  }
};
