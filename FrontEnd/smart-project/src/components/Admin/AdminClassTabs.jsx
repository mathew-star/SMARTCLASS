import React from 'react'
import { NavLink, useParams } from 'react-router-dom'

function AdminClassTabs() {
    const {classId}=useParams()
  return (
    <>
    <div className="flex justify-between w-[50%] ms-[20%] mb-10 text-white text-xl">
      <NavLink
        to={`/admin/h/c/${classId}/members`}
        className={({ isActive }) =>
          isActive ? "py-2 px-4 border-b-2 border-green-500 text-white" : "py-2 px-4 text-white"
        }
      >
        Members
      </NavLink>
      </div>
    </>
  )
}

export default AdminClassTabs
