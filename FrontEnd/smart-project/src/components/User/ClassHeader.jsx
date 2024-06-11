import useClassStore from '@/store/classStore';
import React, { useEffect } from 'react'
import { FaRegCopy } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ClassHeader() {
  const {classId}=useParams()
  const fetchClassroomById = useClassStore((state)=> state.fetchClassroomById)
  useEffect(()=>{
    fetchClassroomById(classId);
  },[])


    const currentClass = useClassStore((state) => state.currentClass);
    const userRoleInClass = useClassStore((state) => state.userRoleInClass);
    const navigate=useNavigate()

    const isTeacher= userRoleInClass.role==='teacher'? true:false;

    const handleCopy = () => {
      navigator.clipboard.writeText(currentClass.code).then(() => {
        // Show a notification or alert to the user
        toast.success('Class code copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy class code.');
      });
    };
    console.log(currentClass)

  return (
    <>
      <div className="w-full border-b-2 rounded shadow-2xl shadow-[#1f1f28] p-4 mb-8 flex justify-between items-center">
        <div className="flex flex-col md:flex-row text-2xl">
          <h1 className="text-3xl font-bold">{currentClass.title}</h1>
          <p className="mt-2 md:mt-0 md:ml-8">{currentClass.description}</p>
        </div>

        <div className="flex items-center text-2xl">
          <p className="mr-2">Code: {currentClass.code}</p>
          <FaRegCopy onClick={handleCopy} className="cursor-pointer me-12 w-6 h-6" />
          {isTeacher && (
            <IoMdSettings onClick={()=>navigate(`/c/${currentClass.id}/classroom`)} className="w-8 h-8 cursor-pointer" />
          )}
          
        </div>
        
      </div>
      <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            />
    </>
  )
}

export default ClassHeader
