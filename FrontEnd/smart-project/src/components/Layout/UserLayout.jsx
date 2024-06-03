
import React from 'react'
import Navbar from '@/components/User/Navbar'
import HomeSidebar from '../User/HomeSidebar'
import { Outlet } from 'react-router-dom'


function UserLayout() {
  return (
    <>
    <div className="flex w-full min-h-screen bg-[#1F2937]">
      <HomeSidebar />
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

export default UserLayout
