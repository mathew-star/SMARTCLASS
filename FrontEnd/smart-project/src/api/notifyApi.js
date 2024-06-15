import axios from 'axios';
import axiosInstance from './axiosInstance';


const notifyApi={
    fetchNotifications: async () => {
        try {
          const response = await axiosInstance.get('/notifications/');
          return response.data
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      },

      markAllAsRead: async () => {
        try {
          const response=await axiosInstance.post('/notifications/mark-all-read/');
          return response.data
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      },

}

export default notifyApi