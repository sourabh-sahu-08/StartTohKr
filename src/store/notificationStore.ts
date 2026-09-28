import { create } from 'zustand';
import { notificationApi } from '@/lib/api/notification.api';

export interface EcosystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: EcosystemNotification[];
  isLoading: boolean;
  
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<EcosystemNotification, 'id' | 'read' | 'createdAt'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  (set, get) => ({
    notifications: [],
    isLoading: false,
    
    fetchNotifications: async () => {
      set({ isLoading: true });
      try {
        const data = await notificationApi.getAll();
        set({ notifications: data as any[] });
      } catch (err) {
        console.error(err);
      } finally {
        set({ isLoading: false });
      }
    },
    
    addNotification: async (notif) => {
      try {
        await notificationApi.createSystem(notif.userId, notif.title, notif.message, notif.link);
        await get().fetchNotifications();
      } catch (e) {
        console.error(e);
      }
    },
    
    markAsRead: async (id) => {
      try {
        await notificationApi.markAsRead(id);
        await get().fetchNotifications();
      } catch (e) {
        console.error(e);
      }
    },
    
    markAllAsRead: async () => {
      try {
        await notificationApi.markAllAsRead();
        await get().fetchNotifications();
      } catch (e) {
        console.error(e);
      }
    },
    
    getUnreadCount: () => {
      return get().notifications.filter(n => !n.read).length;
    }
  })
);
