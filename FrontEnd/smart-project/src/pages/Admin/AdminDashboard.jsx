import React from 'react'
import { SiGoogleclassroom } from "react-icons/si";
import { FaHome, FaUsers, FaChalkboardTeacher, FaChevronUp, FaChevronDown, FaBookOpen } from 'react-icons/fa';
import { MdAssignment } from "react-icons/md";

function AdminDashboard() {
  return (
    <div>
        <div class="grid grid-cols-3 gap-4 mt-10 p-10">
            <div class="bg-[#13172b] flex flex-row justify-between items-center p-12 border-l-[18px] border-[#24b842] rounded-lg ">
                <FaUsers className="w-16 h-16 text-white"/>
                <div className='flex flex-col items-center'>
                    <p className='text-2xl text-white'>20</p>
                    <p className='text-2xl text-white'>Users</p>
                </div>
            </div>
            <div class="bg-[#13172b] flex flex-row justify-between items-center p-12 border-l-[18px] border-[#22c098] rounded-lg ">
                <SiGoogleclassroom className='w-16 h-16 text-white'/>

                <div className='flex flex-col items-center'>
                    <p className='text-2xl text-white'>16</p>
                    <p className='text-2xl text-white'>Classrooms</p>
                </div>
            </div>
            <div class="bg-[#13172b] flex flex-row justify-between items-center p-12 border-l-[18px] border-[#1b6197] rounded-lg ">
                <MdAssignment className='w-16 h-16 text-white' />
                <div className='flex flex-col items-center'>
                    <p className='text-2xl text-white'>20</p>
                    <p className='text-2xl text-white'>Assignments</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminDashboard
