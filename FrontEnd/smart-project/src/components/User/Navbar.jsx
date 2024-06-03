import useAuthStore from '@/store/authStore';
import React, { useState } from 'react';
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

function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { fetchTeachingClasses, fetchEnrolledClasses } = useClassStore();
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
                <Link to="profile">
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
    </>
  );
}

export default Navbar;
