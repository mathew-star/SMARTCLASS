import authApi from '@/api/authApi';
import axiosInstance from '../api/axiosInstance';
import { AUTH_TOKEN_KEY } from '../utils/constants';


// Function to get user data
export const getUserData = async () => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await axiosInstance.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data', error);
    throw error;
  }
};

// Function to update user profile
export const updateUser = async (userData) => {
  try { 
    console.log(userData)
    const response = await authApi.updateUser(userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error;
  }
};
