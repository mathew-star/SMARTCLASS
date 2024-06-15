import {create} from 'zustand';
import axios from 'axios';
import notifyApi from '@/api/notifyApi';


const useNotificationStore = create((set) => ({
  notifications: [],

  fetchNotifications: async () => {
    try {
      const response = await notifyApi.fetchNotifications();
      set({ notifications: response});
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },
  markAllAsRead: async () => {
    try {
      await notifyApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      }));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  },
}));

export default useNotificationStore;
