import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import Navbar from '@/components/User/Navbar';
import Sidebar from '@/components/User/HomeSidebar';
import ClassCard from '@/components/User/ClassCard';
import classApi from '../../api/classroomApi';
import useClassStore from '../../store/classStore'



function Userhome() {
  const location = useLocation();
  const refresh = useAuthStore((state) => state.refreshAccessToken);
  const fetchUser = useAuthStore((state) => state.fetchUserDataAndUpdateStore);
  const user = useAuthStore((state) => state.user);
  const current_user = localStorage.getItem("User");
  const { teachingClasses, enrolledClasses, fetchTeachingClasses, fetchEnrolledClasses,fetchClassMembers   } = useClassStore();

  useEffect(() => {
    refresh();
    fetchUser();
    fetchTeachingClasses();
    fetchEnrolledClasses();
    fetchClassMembers();

  }, [current_user]);


  console.log("Home..")

  



  
  return (
    <>
      {teachingClasses.length > 0 && (
        <div>
          <h1 className="text-3xl text-white mb-4">Teaching Classes</h1>
          <div className="flex flex-wrap">
            {teachingClasses.map((classroom) => (
              <ClassCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        </div>
      )}

      {enrolledClasses.length >0 &&(
        <div>
          <h1 className="text-3xl text-white mt-8 mb-4">Enrolled Classes</h1>
              <div className="flex flex-wrap">
                {enrolledClasses.map((classroom) => (
                  <ClassCard key={classroom.id} classroom={classroom} />
                ))}
              </div>
        </div>
      )}

              
              
      
    </>
  )
}

export default React.memo(Userhome)
