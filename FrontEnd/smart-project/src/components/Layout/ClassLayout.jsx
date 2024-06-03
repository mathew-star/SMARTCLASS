import useClassStore from '@/store/classStore';
import React from 'react'
import { Outlet } from 'react-router-dom'
import ClassHeader from '../User/ClassHeader';
import LabTabs from '../User/LabTabs';
import ClassroomTabs from '../User/ClassroomTabs';


function ClassLayout() {
    const userRoleInClass = useClassStore((state) => state.userRoleInClass);

  return (
    <>
    <div className='p-4 text-white'>

        <ClassHeader/>
        <ClassroomTabs/>
        <main>
            <Outlet/>
        </main>
    </div>

      
    </>
  )
}

export default ClassLayout
