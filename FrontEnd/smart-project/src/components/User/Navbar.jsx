import useAuthStore from '@/store/authStore';
import React, { useEffect, useState } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateClassModal from './CreateClassModal';
import classApi from '../../api/classroomApi';
import JoinClassModal from './JoinClassModal';
import useClassStore from '@/store/classStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoNotifications } from "react-icons/io5";
import useNotificationStore from '@/store/notificationStore';


function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { fetchTeachingClasses, fetchEnrolledClasses } = useClassStore();
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) => state.notifications);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);

  useEffect(() => {
    fetchNotifications();
  }, []);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCreateSave = async (classData) => {
    try{
      const resp= await classApi.createClassroom(classData)
      console.log(resp)
      fetchTeachingClasses()
    }
    catch(error){
      console.error(error)
      toast.error(error.response.data.error);
    }
    
  };
  const handleJoinSave=async(code)=>{
    try{
      const response= await classApi.joinClassroom(code)
      console.log(response)
      fetchEnrolledClasses()
    }
    catch(error){
      console.error(error)
    }
  }
  return (
    <>
      <div className="bg-[#1C1D2B] text-white flex justify-between items-center p-4 rounded-b-lg shadow-lg">
        <div className="text-3xl font-bold">SMARTCLASS</div>
        <div className="flex items-center space-x-4">
        <div className='relative p-1'>
          {notifications &&(
            <>
            <div className='border bg-red-700 rounded-full absolute top-0 right-0 w-6 h-6 flex justify-center items-center'>
              <p>{notifications.length}</p>
            </div>
            </>
          )}
        <IoNotifications onClick={()=>navigate('/notification')}  className='w-7 h-7 me-3 cursor-pointer'/>
        </div>
          <div className="relative">
            <IoMdAdd className='text-white w-8 h-8 me-4 cursor-pointer' onClick={toggleDropdown} />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#515670] rounded-md shadow-lg py-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#0d9488]"
                >
                  Create Classroom
                </button>
                <button onClick={()=>setIsJoinModalOpen(true)}  className="block w-full text-left px-4 py-2 text-white hover:bg-[#0d9488]">
                  Join Classroom
                </button>
              </div>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link to="/profile">
                  <FaUser className="cursor-pointer w-6 h-7 me-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <FaSignOutAlt className="cursor-pointer w-11 h-8 me-3" onClick={handleLogout} />
        </div>
      </div>

      {/* Modal */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSave}
      />
      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSave={handleJoinSave}
      />

<ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            />
    </>
  );
}

export default Navbar;
