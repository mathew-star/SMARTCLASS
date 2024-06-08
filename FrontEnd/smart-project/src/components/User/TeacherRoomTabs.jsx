import useClassStore from '@/store/classStore';
import React from 'react'
import { NavLink, useParams } from 'react-router-dom';

function TeacherRoomTabs() {
    const {classId,assignmentId} = useParams()
    const userRoleInClass = useClassStore((state) => state.userRoleInClass);

    const isTeacher= userRoleInClass.role==='teacher'? true:false;
  return (
    <>
      <div className="flex w-[50%] ms-5  mb-10 text-white text-xl">
      <NavLink
        to={`/c/${classId}/t/${assignmentId}/assignment_details`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 me-10 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        Assignment
      </NavLink>
      <NavLink
        to={`/c/${classId}/t/${assignmentId}/student_works`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 ms-10 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        Works
      </NavLink>


    </div>
    </>
  )
}

export default TeacherRoomTabs
