import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useClassStore from '../../store/classStore';
import { BASE_URL } from '@/utils/constants';
import { IoMdSettings } from "react-icons/io";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { MdSend } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";

const ClassDashboard = () => {
  const { classId } = useParams();
  const currentClass = useClassStore((state) => state.currentClass);
  const userRoleInClass = useClassStore((state) => state.userRoleInClass);
  const isTeacher= userRoleInClass==='teacher'? true:false
  const fetchUserRoleInClass = useClassStore((state) => state.fetchUserRoleInClass);
  const fetchClassroomById = useClassStore((state) => state.fetchClassroomById);

  useEffect(() => {
    fetchClassroomById(classId);
    fetchUserRoleInClass(classId);
  }, [classId]);

  return (

      
      <div className="flex flex-col justify-center items-center">
        <img
          className="rounded-lg object-cover w-full md:w-[80%] lg:w-[60%] h-64 md:h-80 mb-10"
          src={`${BASE_URL}${currentClass.banner_image}`}
          alt={currentClass.title}
        />
        {isTeacher &&(
          <div className="flex w-full md:w-[80%] lg:w-[60%] h-20 rounded-lg bg-[#17192F] opacity-90 items-center px-4">
          <FaUser className="text-white w-6 h-7" />
          <input
            type="text"
            placeholder="Announce something to class"
            className="ml-4 w-full h-10 px-4 py-2 bg-[#434345] border border-[#17192F] rounded-full shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400"
          />
          <MdSend className="cursor-pointer w-6 h-7 ml-4" />
        </div>
        )

        }
        
      </div>

  );
};

export default ClassDashboard;
