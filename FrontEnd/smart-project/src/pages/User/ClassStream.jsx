import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useClassStore from '../../store/classStore';
import { BASE_URL } from '@/utils/constants';
import { IoMdSettings } from "react-icons/io";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { MdSend } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import classApi from '@/api/classroomApi';
import Loader from '@/components/ui/Loader';

function ClassStream() {
    const { classId } = useParams();
    const fetchUserRoleInClass = useClassStore((state) => state.fetchUserRoleInClass);
    const fetchClassroomById = useClassStore((state) => state.fetchClassroomById);
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState('');
    //hel
    const getAnnouncements=async(classId)=>{
      try{
      const data= await classApi.fetchAnnouncements(classId);
      setAnnouncements(data)
      }
      catch(error){
        console.error('error')
      }
    }
  
    useEffect(() => {
      

       getAnnouncements(classId);
       fetchClassroomById(classId);
       fetchUserRoleInClass(classId);
    }, [classId]);


    const currentClass = useClassStore((state) => state.currentClass);
    const userRoleInClass = useClassStore((state) => state.userRoleInClass);
    
    const isTeacher= userRoleInClass.role==='teacher'? true:false

    const handleAnnouncementChange = (e) => {
        setNewAnnouncement(e.target.value);
    };

    const handleAnnouncementSubmit = async () => {
        if (!newAnnouncement.trim()) return;

        try {
            await classApi.PostAnnouncement(classId,newAnnouncement);
            setNewAnnouncement('');
            getAnnouncements(classId);
        } catch (error) {
            console.error('Error posting announcement:');
        }
    };
  
    return (
  
        
        <div className="flex flex-col justify-center items-center">
         {currentClass.banner_image_url ? (
      <img
        className="rounded-lg object-cover w-full md:w-[80%] lg:w-[60%] h-64 md:h-80 mb-10"
        src={currentClass.banner_image_url}
        alt={currentClass.title}
        onError={(e) => {
          console.error('Error loading image:', e);
        }}
      />
    ) : (
      <p>No banner image available</p>
    )}
  
          {isTeacher &&(
            <div className="mt-6 w-full md:w-[80%] lg:w-[60%] items-center mb-10  flex flex-row bg-[#4c515d] p-8 rounded">
              <textarea
                  value={newAnnouncement}
                  onChange={handleAnnouncementChange}
                  className="w-full p-2 border bg-[#1a2b50] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write an announcement..."
              />
              <button
                  onClick={handleAnnouncementSubmit}
                  className="mt-5 w-20 h-10 ms-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                  Post
              </button>
          </div>
          )}

          <div className='lg:w-[60%] sm:w-[100%]'>
            <h2 className="text-2xl text-center font-bold mb-4">Announcements</h2>
              <div className="mb-4 ">
                  {announcements&&(
                    <>
                        {announcements.length > 0 ? (
                      announcements.map((announcement) => (
                          <div key={announcement.id} className="mb-4 p-4 bg-[#091024] rounded-lg shadow">
                              <div className="flex justify-between items-center text-white ">
                                  <div>
                                      
                                      <p className="mt-1">{announcement.announcement}</p>
                                      {/* <strong className="text-sm">{announcement.user.name}</strong> */}
                                  </div>
                                  <div className="">
                                      {new Date(announcement.created_at).toLocaleString()}
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <p className="text-gray-600">No announcements yet.</p>
                  )}
                    
                    </>

                  )}
              </div>
          </div>

        </div>
  
    );
}

export default ClassStream
