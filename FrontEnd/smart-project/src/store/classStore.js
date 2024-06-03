import {create} from 'zustand';
import classApi from '../api/classroomApi';

const useClassStore = create((set)=>({
    
    teachingClasses: [],
    enrolledClasses: [],
    userRoleInClass: null,



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



}));

export default useClassStore;