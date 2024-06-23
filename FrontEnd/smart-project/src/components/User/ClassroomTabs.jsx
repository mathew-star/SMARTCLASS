import useClassStore from '@/store/classStore';
import React, { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Loader from '../ui/Loader';

const ClassroomTabs = () => {
  const { classId } = useParams();
  
  const fetchUserRoleInClass = useClassStore((state) => state.fetchUserRoleInClass);
  const fetchClassroomById = useClassStore((state) => state.fetchClassroomById);

  

  useEffect(()=>{
    fetchUserRoleInClass(classId);
    fetchClassroomById(classId)
  },[])
  const userRoleInClass = useClassStore((state) => state.userRoleInClass);
  if (!userRoleInClass) {
    return <Loader/>; 
  }
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

      <NavLink
        to={`/c/${classId}/discussion`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        Discuss
      </NavLink>

        <NavLink
        to={`/c/${classId}/grade`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        Leaderboard
      </NavLink>

    </div>
  );
};

export default ClassroomTabs;
