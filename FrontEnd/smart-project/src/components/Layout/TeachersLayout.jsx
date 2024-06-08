import React, { useEffect } from 'react'
import useClassStore from '@/store/classStore';
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import ClassHeader from '../User/ClassHeader';

import ClassroomTabs from '../User/ClassroomTabs';
import TeacherRoomTabs from '../User/TeacherRoomTabs';

function TeachersLayout() {
    const {classId} = useParams()
    const userRoleInClass = useClassStore((state) => state.userRoleInClass);
    const fetchUserRoleInClass = useClassStore((state) => state.fetchUserRoleInClass);
    const { fetchClassMembers,fetchClassroomById   } = useClassStore();
    const navigate = useNavigate()

    const isTeacher= userRoleInClass.role==='teacher'? true:false;


    useEffect(() => {
      fetchClassroomById(classId);
      fetchUserRoleInClass(classId);
      fetchClassMembers(classId);
    }, [fetchClassroomById,classId, fetchUserRoleInClass, fetchClassMembers]);

    
  return (
    <>
        <div className='p-4 text-white'>

            <TeacherRoomTabs/>
            <main>
                <Outlet/>
            </main>
        </div>
      
    </>
  )
}

export default TeachersLayout
