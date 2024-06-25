// src/components/ClassCard.js
import React, { useEffect } from 'react';
import { BASE_URL } from '@/utils/constants';
import { RxEnter } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import useClassStore from '@/store/classStore';

function ClassCard({ classroom }) {

  const navigate = useNavigate();
  const fetchUserRoleInClass = useClassStore((state) => state.fetchUserRoleInClass);
  const fetchClassroomById = useClassStore((state) => state.fetchClassroomById);
  

  useEffect(()=>{
    const fetchClass= async()=>{
      await fetchClassroomById(classroom.id);
      await fetchUserRoleInClass(classroom.id);
    }

    fetchClass();
  },[])



  const handleClick = async () => {
    await fetchClassroomById(classroom.id);
    await fetchUserRoleInClass(classroom.id);
    navigate(`/c/${classroom.id}/stream`);

  };
  return (
    <div className="bg-[#596173] text-white rounded-lg shadow-md overflow-hidden w-64 m-4">
      {classroom.banner_image_url &&(
          <img 
          src={classroom.banner_image_url} 
          alt={classroom.title} 
          className="w-full h-32 object-cover"
        />
      )}
      
      
      <div className="p-4">
        <h2 className="text-2xl font-bold mt-3">{classroom.title}</h2>
        <p className="text-sm mb-3 ">{classroom.sections}</p>
        
      </div>
      <hr className='mb-2'/>
      <RxEnter onClick={handleClick} className='w-8 h-8 float-end me-4 mb-3 cursor-pointer'  />
    </div>
  );
}

export default ClassCard;
