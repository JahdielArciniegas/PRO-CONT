import { create } from "zustand";

type Notification = {
  message: string;
  type: "success" | "error" | "warning" | "info";
};

type NotificationStore = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  addNotification: (notification) => {
    set((state) => ({ notifications: [...state.notifications, notification] }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification !== notification
        ),
      }));
    }, 3000);
  },
}));
