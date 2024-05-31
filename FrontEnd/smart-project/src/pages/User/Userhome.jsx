import React, { useEffect, useMemo } from 'react'
import UserProfile from './UserProfile'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import Navbar from '@/components/User/Navbar'
import Sidebar from '@/components/User/HomeSidebar'






function Userhome() {
  const navigate = useNavigate()
  const logout = useAuthStore((state)=>state.logout)
  const refresh= useAuthStore((state)=>state.refreshAccessToken)
  const fetchUser = useAuthStore((state)=>state.fetchUserDataAndUpdateStore)
  const user = useAuthStore((state)=>state.user)
  const current_user = localStorage.getItem("User")
  console.log("Current :::",current_user)



  console.log("Userhome")
  console.log("User:",user);

  
  useEffect(()=>{
    console.log("useEffect")

    refresh();
    fetchUser();

  },[current_user])

  const teachingClasses = [];
  const enrolledClasses = [];



  
  return (
    <>
    <div className="flex w-full min-h-screen bg-[#1F2937]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
      
      
      
    </>
  )
}

export default React.memo(Userhome)
