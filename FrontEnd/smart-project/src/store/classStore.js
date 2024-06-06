import {create} from 'zustand';
import classApi from '../api/classroomApi';

const useClassStore = create((set)=>({
    currentClass:null,
    teachingClasses: [],
    enrolledClasses: [],
    userRoleInClass: null,
    classMembers: { teacher: null, students: [] },



    fetchTeachingClasses: async () => {
        try {
          const classes = await classApi.fetchTeachingClasses();
          set({ teachingClasses: classes });
        } catch (error) {
          console.error('Failed to fetch teaching classes:', error);
        }
      },
    
      fetchEnrolledClasses: async () => {
        try {
          const classes = await classApi.fetchEnrolledClasses();
          set({ enrolledClasses: classes });
        } catch (error) {
          console.error('Failed to fetch enrolled classes:', error);
        }
      },

    fetchUserRoleInClass: async (classId) => {
        try {
            const userRoleInClass = await classApi.fetchUserRoleInClass(classId);
            set({ userRoleInClass });
        } catch (error) {
            console.error('Failed to fetch user role in class:', error);
        }
    },

    fetchClassroomById: async (classId) => {
      try {
        const classroom = await classApi.fetchClassroomById(classId);
        console.log("FetchStore: ",classroom)
        set({ currentClass: classroom });
      } catch (error) {
        console.error('Failed to fetch classroom details:', error);
      }
    },

    fetchClassMembers: async (classId) => {
      try {
        const classMembers = await classApi.fetchClassMembers(classId);
        set({ classMembers });
      } catch (error) {
        console.error('Failed to fetch class members:', error);
      }
    },
  
    removeStudents: async (classId, studentIds) => {
      try {
        await classApi.removeStudents(classId, studentIds);
        // Optionally, you can refetch the members after removal
        set((state) => ({
          classMembers: {
            ...state.classMembers,
            students: state.classMembers.students.filter((student) => !studentIds.includes(student.id)),
          },
        }));
      } catch (error) {
        console.error('Failed to remove students:', error);
      }
    },



}));

export default useClassStore;