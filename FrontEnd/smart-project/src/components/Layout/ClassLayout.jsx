import useClassStore from '@/store/classStore';
import React, { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import ClassHeader from '../User/ClassHeader';

import ClassroomTabs from '../User/ClassroomTabs';


function ClassLayout() {
  const {classId} = useParams()
    const userRoleInClass = useClassStore((state) => state.userRoleInClass);
    const fetchUserRoleInClass = useClassStore((state) => state.fetchUserRoleInClass);
    const { teachingClasses, enrolledClasses,fetchClassMembers,fetchClassroomById   } = useClassStore();
    const navigate = useNavigate()


    useEffect(() => {
      fetchClassroomById(classId);
    }, [fetchClassroomById]);
  
    useEffect(() => {
      if (classId) {
        fetchUserRoleInClass(classId);
        fetchClassMembers(classId);
      }
    }, [classId, fetchUserRoleInClass, fetchClassMembers]);
  


  return (
    <>
    <div className='p-4 text-white'>

        <ClassHeader/>
        <ClassroomTabs/>
        <main>
            <Outlet/>
        </main>
    </div>

      
    </>
  )
}

export default React.memo(ClassLayout)
