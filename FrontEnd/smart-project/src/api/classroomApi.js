import axios from 'axios';
import axiosInstance from './axiosInstance';
import { API_BASE_URL, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'

const classApi = {
    createClassroom : async(classData)=>{
        try{
        const response = await axiosInstance.post('/class/create/',classData)
        return response.data
        }
        catch(error){
            console.error
        }
    },

    joinClassroom:async (code)=>{
        try{
        const response = await axiosInstance.post('/class/join/',{'code':code});
        return response.data
        }
        catch(error){
            console.error(error);
        }
    },

    fetchTeachingClasses: async () => {
        try {
            const response = await axiosInstance.get('/class/teaching/');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch teaching classes:', error);
            throw error;
        }
    },

    fetchEnrolledClasses: async () => {
        try {
            const response = await axiosInstance.get('/class/enrolled/');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch enrolled classes:', error);
            throw error;
        }
    },

    fetchUserRoleInClass: async (classId) => {
        try {
            const response = await axiosInstance.get(`/class/user-role/${classId}/`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user role in class:', error);
            throw error;
        }
    },

};

export default classApi;