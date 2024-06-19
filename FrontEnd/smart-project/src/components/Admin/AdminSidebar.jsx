import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaChalkboardTeacher, FaChevronUp, FaChevronDown, FaBookOpen } from 'react-icons/fa';
import { GoSidebarCollapse } from 'react-icons/go';
import useAuthStore from '@/store/authStore';
import { BASE_URL } from '@/utils/constants';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { SiGoogleclassroom } from 'react-icons/si';

const AdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTeachingOpen, setIsTeachingOpen] = useState(false);
  const [isEnrolledOpen, setIsEnrolledOpen] = useState(false);
  const user = useAuthStore((state)=>state.user)
  console.log(user)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTeachingDropdown = () => {
    setIsTeachingOpen(!isTeachingOpen);
  };

  const toggleEnrolledDropdown = () => {
    setIsEnrolledOpen(!isEnrolledOpen);
  };

  return (
    <div className="flex">
      <div  className={` ${isSidebarOpen ? "w-72" : "w-20 "}  bg-[#2E3748] h-screen p-5 pt-8 relative duration-300`}>
        <GoSidebarCollapse 
          className={`absolute cursor-pointer text-white -right-3 top-9 w-6 h-6 ${!isSidebarOpen && "rotate-180"}`} 
          onClick={toggleSidebar}
        />
        <div className="flex gap-x-4 items-center mb-6">
          {user.profile_pic? 
            <img
            src={`${BASE_URL}${user.profile_pic}`} 
            alt="Profile"
            className="w-10 h-10 rounded-full"
          /> :
          <Avatar sx={{ bgcolor: deepOrange[500] }}>{user.name[0]}</Avatar>
        }
          <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!isSidebarOpen && "scale-0"}`}>
            {user.name}
          </h1>
        </div>
        <ul className="pt-6">
          <li className="flex rounded-md p-2 cursor-pointer hover:bg-[#39425A] text-gray-300 text-sm items-center gap-x-4">
            <FaHome className="w-8 h-8"/>
            <Link to={'/admin/h'} className={`${!isSidebarOpen && "hidden"} origin-left text-2xl duration-200`}>
              Dashboard
            </Link>
          </li>
          <li className="flex rounded-md p-2 mt-4 cursor-pointer hover:bg-[#39425A] text-gray-300 text-sm items-center gap-x-4">
            <FaUsers className="w-8 h-8"/>
            <Link to={'/admin/h/users'} className={`${!isSidebarOpen && "hidden"} origin-left text-2xl duration-200`}>
              Users
            </Link>
          </li>

          <li className="flex rounded-md p-2 mt-4 cursor-pointer hover:bg-[#39425A] text-gray-300 text-sm items-center gap-x-4">
          <SiGoogleclassroom  className='w-8 h-8'/>
            <Link to={'/admin/h/classrooms'} className={`${!isSidebarOpen && "hidden"} origin-left text-2xl duration-200`}>
              Classrooms
            </Link>
          </li>


        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
