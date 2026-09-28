import { NotificationRepository } from "../repositories/notification.repository";

export const NotificationService = {
  async fetchNotifications(userId: string) {
    return NotificationRepository.getByUserId(userId);
  },

  async markAsRead(id: string, userId: string) {
    return NotificationRepository.markAsRead(id, userId);
  },

  async markAllAsRead(userId: string) {
    return NotificationRepository.markAllAsRead(userId);
  },

  async createSystemNotification(recipientId: string, title: string, body: string, relatedEntity: string) {
    return NotificationRepository.create({
      recipientId,
      type: "SYSTEM",
      title,
      body,
      relatedEntity,
      read: false
    });
  }
};
