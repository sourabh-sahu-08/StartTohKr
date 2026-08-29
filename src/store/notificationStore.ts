import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EcosystemNotification {
  id: string;
  userId: string; // The receiver
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: EcosystemNotification[];
  addNotification: (notification: Omit<EcosystemNotification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notif) => set((state) => ({
        notifications: [
          {
            ...notif,
            id: `notif-${Date.now()}`,
            read: false,
            createdAt: new Date()
          },
          ...state.notifications
        ]
      })),
      
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      
      markAllAsRead: (userId) => set((state) => ({
        notifications: state.notifications.map(n => n.userId === userId ? { ...n, read: true } : n)
      })),
      
      getUnreadCount: (userId) => {
        return get().notifications.filter(n => n.userId === userId && !n.read).length;
      }
    }),
    {
      name: 'starttohkr-notifications',
    }
  )
);
