import { BASE_URL } from '@/utils/constants'
import React from 'react'
import { RxEnter } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom';

function AdminClassCards({classroom}) {
    const navigate=useNavigate()

    const handleClick = async () => {

        navigate(`/admin/h/c/${classroom.id}/members`);
    
      };
      console.log("cards")
  return (
    <>
      <div className="bg-[#596173] text-white rounded-lg shadow-md overflow-hidden w-64 m-4">
      <img 
        src={`${BASE_URL}${classroom.banner_image}`} 
        alt={classroom.title} 
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold mt-3">{classroom.title}</h2>
        <p className="text-sm mb-3 ">{classroom.sections}</p>
        
      </div>
      <hr className='mb-2'/>
      <RxEnter onClick={handleClick} className='w-8 h-8 float-end me-4 mb-3 cursor-pointer'  />
    </div>
    </>
  )
}

export default AdminClassCards
