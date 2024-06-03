import useClassStore from '@/store/classStore';
import React from 'react'
import { FaRegCopy } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

function ClassHeader() {
    const currentClass = useClassStore((state) => state.currentClass);
    const userRoleInClass = useClassStore((state) => state.userRoleInClass);

    const isTeacher= userRoleInClass.role==='teacher'? true:false;

  return (
    <>
      <div className="w-full border-b-2 rounded shadow-2xl shadow-[#1f1f28] p-4 mb-8 flex justify-between items-center">
        <div className="flex flex-col md:flex-row text-2xl">
          <h1 className="text-3xl font-bold">{currentClass.title}</h1>
          <p className="mt-2 md:mt-0 md:ml-8">{currentClass.description}</p>
        </div>

        <div className="flex items-center text-2xl">
          <p className="mr-2">Code: {currentClass.code}</p>
          <FaRegCopy className="cursor-pointer me-12 w-6 h-6" />
          {isTeacher && (
            <IoMdSettings className="w-8 h-8" />
          )}
          
        </div>
      </div>
    </>
  )
}

export default ClassHeader
