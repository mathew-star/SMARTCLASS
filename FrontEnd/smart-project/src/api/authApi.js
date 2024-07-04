// src/api/authApi.js
import axios from 'axios';
import axiosInstance from './axiosInstance';
import { API_BASE_URL, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'


const authApi = {
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/users/login/`, credentials);
    console.log(response.data)
    return response.data;
  },
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/users/register/', userData);
      return response.data
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  refresh: async (refreshToken) => {
    const response = await axiosInstance.post('/users/login/refresh/', { refresh: refreshToken });
    console.log("Refresh",response)
    return response.data;
  },
  logout: async (refreshToken) => {
    const response = await axiosInstance.post('/users/logout/', { refresh_token: refreshToken });
    return response.data;
  },
  updateUser: async (userDetails) => {
    const response = await axiosInstance.put(`/users/user/${userDetails.get('id')}/`, userDetails, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  blockUser:async (userId)=>{
    const response = await axiosInstance.post(`/users/block-user/${userId}/`);
    return response.data
  },

  unblockUser:async (userId)=>{
    const response = await axiosInstance.post(`/users/unblock-user/${userId}/`);
    return response.data
  },

  fetchUsers:async()=>{
    const response = await axiosInstance.get('/users/users/')
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/users/user/${userId}/`);
    return response.data;
  },

  otprequest: async (values) =>{
    console.log( "otpreq");
    console.log(values)
    const otprequest_response = await axios.post(`${API_BASE_URL}/users/otp-request/`,values)
    return otprequest_response.data

  },

  verifyOtp: async (values) => {
      const otpVerifyResponse = await axios.post(`${API_BASE_URL}/users/otp-verify/`,values);
      console.log(otpVerifyResponse);
      return otpVerifyResponse.data;
  },

  resetPassword:async(values)=>{
    const response = await axiosInstance.post('/users/reset-password/',values)
    return response.data
  },
  
  
};

export default authApi;
