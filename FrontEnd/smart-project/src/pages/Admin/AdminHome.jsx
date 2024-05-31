import AdminNavbar from '@/components/Admin/AdminNavbar'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import useAuthStore from '@/store/authStore'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Userhome from '../User/Userhome'

 function AdminHome() {
  const refresh= useAuthStore((state)=>state.refreshAccessToken)
  const fetchUser = useAuthStore((state)=>state.fetchUserDataAndUpdateStore)

console.log("Admin home")


  useEffect(()=>{
    console.log("useEffect")

    refresh();
    fetchUser();

  },[])

  return (
    <>
    <div className="flex w-full min-h-screen bg-[#1F2937]">
      <AdminSidebar/>
      <div className="flex-1 flex flex-col">
        <AdminNavbar/>
        <div className="p-4 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
      
    </>
  )
}

export default React.memo(AdminHome)