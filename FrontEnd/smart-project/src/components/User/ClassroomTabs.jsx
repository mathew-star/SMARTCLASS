import useClassStore from '@/store/classStore';
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

const ClassroomTabs = () => {
  const { classId } = useParams();
  const userRoleInClass = useClassStore((state) => state.userRoleInClass);

  const isTeacher= userRoleInClass.role==='teacher'? true:false;

  return (
    <div className="flex justify-between w-[50%] ms-[20%] mb-10 text-white text-xl">
      <NavLink
        to={`/c/${classId}/stream`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        Stream
      </NavLink>
      <NavLink
        to={`/c/${classId}/works`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        Classworks
      </NavLink>
      <NavLink
        to={`/c/${classId}/people`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        People
      </NavLink>
      {isTeacher && (
        <NavLink
        to={`/c/${classId}/grade`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        Grades
      </NavLink>
      )}
    </div>
  );
};

export default ClassroomTabs;
