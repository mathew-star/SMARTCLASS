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
            throw error
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
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user role in class:', error);
            throw error;
        }
    },

    fetchClassroomById: async (classroomId) => {
        try {
            const response = await axiosInstance.get(`/class/classroom/${classroomId}/`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch classroom details:', error);
            throw error;
        }
    },

    updateClassroom: async (classId, updatedData) => {
      try {
        const response = await axiosInstance.put(`/class/classroom/${classId}/`, updatedData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error updating classroom:', error);
        throw error;
      }
    },
  
    deleteClassroom: async (classId) => {
      try {
        const response = await axiosInstance.delete(`/class/classroom/${classId}/`);
        return response.data;
      } catch (error) {
        console.error('Error deleting classroom:', error);
        throw error;
      }
    },

     fetchClassMembers : async (classId) => {
        try{
        const response = await axiosInstance.get(`/class/classrooms/${classId}/members/`);
        return response.data;
        }
        catch(error){
            console.error(error);
        }
      },
      
      removeStudents : async (classId, studentIds) => {
        try{
        const response= await axiosInstance.post(`/class/classrooms/${classId}/remove-students/`, { student_ids: studentIds });
        return response.data
        }
        catch(error){
            console.error(error);
        }
      },

      createAssignment: async (classId,assignmentData) => {
        for (const value of assignmentData.values()) {
          console.log(value);
        }
        try {
          const response = await axiosInstance.post(`/class/classrooms/${classId}/teacher/assignments/`, assignmentData,{
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return response.data;
        } catch (error) {
          console.error('Failed to create assignment:', error);
          throw error;
        }
      },
      
      fetchTopic:async (classId)=>{
        try{
            const response = await axiosInstance.get(`/class/classrooms/${classId}/topics/`)
            return response.data;
        }
        catch(error){
            console.error(error)
        }
      },

      createTopic:async(classId,title)=>{
        try{
            const response = await axiosInstance.post(`/class/classrooms/${classId}/topics/`,{title});
            return response.data;
        }
        catch(error){
            console.log(error)
        }
      },



  fetchAssignments: async (classId) => {
    try {
      const response = await axiosInstance.get(`/class/classrooms/${classId}/teacher/assignments/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      throw error;
    }
  },


  fetchAssignmentDetails:async(classId,assignmentId)=>{
    try{
        const response = await axiosInstance.get(`class/classrooms/${classId}/teacher/assignments/${assignmentId}/`);
        return response.data
    }
    catch(error){
        console.log(error)
    }
  },

  updateAssignment: async (classroomId, assignmentId, formData) => {
    try {
      const response = await axiosInstance.put(`class/classrooms/${classroomId}/teacher/assignments/${assignmentId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  },

  deleteAssignment: async (classroomId, assignmentId) => {
    try {
      const response = await axiosInstance.delete(`class/classrooms/${classroomId}/teacher/assignments/${assignmentId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },

  fetchStudentAssignments:async(classId)=>{
    try{
      const response = await axiosInstance.get(`class/classrooms/${classId}/student/assignments/`);
      return response.data
    }
    catch(error){
      console.log(error)
    }
  },

  fetchStudentsdetails:async(classId,assignmentId)=>{
    const resp= await axiosInstance.get(`class/classrooms/${classId}/assignments/${assignmentId}/`)
    return resp.data
  },

  getStudentAssignments:async()=>{
    try{
      const response= await axiosInstance.get('class/classrooms/student/assignments/')
      return response.data
    }
    catch(error){
      console.log(error)
    }
  },

  submitAssignment:async(classId,assignmentId,formData)=>{
    try{
      const response = await axiosInstance.post(
        `class/classrooms/${classId}/assignments/${assignmentId}/submit/`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
    }
    catch(error){
      console.log(error)
    }
  },


  unsubmitAssignment: async (classId, assignmentId) => {
    try{
    const response = await axiosInstance.delete(`class/classrooms/${classId}/assignments/${assignmentId}/submit/`);
    return response.data;
    }
    catch(error){
      console.log(error)
    }
},


  FetchStudentSubmission:async(classId,assignmentId,studentId)=>{
    try{
      const response = await axiosInstance.get(`class/classrooms/${classId}/submission/${assignmentId}/${studentId}/`);
      return response.data
    }
    catch(error){
      console.log(error)
    }
  },

  getStudentSubmission:async(classId,assignmentId)=>{
    try{
      const response = await axiosInstance.get(`class/classrooms/${classId}/submission/${assignmentId}/`);
      return response.data
    }
    catch(error){
      console.log(error)
    }
  },

  SubmitPoints:async(classId,assignmentId,studentId,points)=>{
    try{
      const response = await axiosInstance.post(`class/classrooms/${classId}/submission/${assignmentId}/${studentId}/`,{'points':points});
      return response.data
    }
    catch(error){
      console.log(error)
    }
  },

  FetchAllClasses:async()=>{
    try{
      const response=await axiosInstance.get('class/classrooms/');
      return response.data
    }
    catch(error){
      console.log(error)
    }
  },

  FetchPrivateComments:async(assignmentId,student_id,teacher_id)=>{
    console.log('jkjkj')
    console.log(teacher_id)
    try{
      const response= await axiosInstance.get(`class/classrooms/private-comment/${assignmentId}/${student_id}/${teacher_id}/`);
      return response.data
    }
    catch(error){
      console.log(error)
    }
  },

  PostPrivateComments:async(assignmentId,student_id,teacher_id,data)=>{
    try{
      const response= await axiosInstance.post(`class/classrooms/private-comment/${assignmentId}/${student_id}/${teacher_id}/`,data);
      return response.data
    }
    catch(error){
      console.log(error)
    }
  },



};

export default classApi;