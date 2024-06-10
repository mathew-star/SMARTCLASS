import React from 'react'
import AdminClassTabs from '../Admin/AdminClassTabs'
import { Outlet } from 'react-router-dom'

function AdminClassroomLayout() {
  return (
    <>
    <AdminClassTabs/>
    <main>
        <Outlet/>
    </main>
      
    </>
  )
}

export default AdminClassroomLayout
