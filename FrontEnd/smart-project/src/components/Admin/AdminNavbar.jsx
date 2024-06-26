import useAuthStore from '@/store/authStore';
import React from 'react'
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function AdminNavbar() {
    const logout = useAuthStore((state)=>state.logout)

  
    const navigate = useNavigate()
    const handleLogout=()=>{
      logout();
      navigate("/admin/login")
    }
  return (
    <>
    <div className="bg-[#1C1D2B] text-white flex justify-between items-center p-4 rounded-b-lg shadow-lg">
      <div className="text-3xl font-bold">WELCOME ADMIN !</div>
      <div className="flex items-center space-x-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger><Link to="/admin/h/profile"><FaUser className="cursor-pointer w-6 h-7 me-4" /></Link></TooltipTrigger>
          <TooltipContent>
            <p></p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
       
        <FaSignOutAlt className="cursor-pointer w-11 h-8 me-3"   onClick={handleLogout} />
      </div>
    </div>
      
    </>
  )
}

export default AdminNavbar
