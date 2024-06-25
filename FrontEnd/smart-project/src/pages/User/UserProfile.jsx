import React, { useState } from 'react';
import { FaRegEdit, FaUserCircle } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';
import { updateUser } from '../../services/userService';
import { BASE_URL } from '@/utils/constants';

const UserProfile = () => {

  const fetchUser = useAuthStore((state)=>state.fetchUserDataAndUpdateStore)
  const { user, setUser } = useAuthStore((state) => ({
    user: state.user,
    setUser: (updatedUser) => state.set((prev) => ({ ...prev, user: updatedUser })),
  }));

  

  const teachingClasses = user?.teachingClasses || [];
  const enrolledClasses = user?.enrolledClasses || [];

  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({ ...user });
  const [profilePicFile, setProfilePicFile] = useState(null);

  console.log(userDetails)

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          profile_pic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userDetails.name);
      formData.append('email', userDetails.email);
      if (profilePicFile) {
        formData.append('profile_pic', profilePicFile);
      }
      formData.append('id', userDetails.id);

      // Add other fields as needed
      const updatedUser = await updateUser(formData);
      fetchUser();
      setIsEditing(false);
      console.log('User details saved:', updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen ">
      <div className="bg-[#151A2C] text-white p-8 rounded-lg shadow-lg w-1/2 h-1/2 flex flex-col items-center">
        <div className="relative">
          {userDetails?.profile_pic ? (
            <img
              src={'user.profile_pic_url'} 
              alt="Profile"
              className="rounded-full object-cover h-32 w-32 mb-4"
            />
          ) : (
            <FaUserCircle className="h-32 w-32 mb-4 text-gray-500" />
          )}
          <button
            onClick={handleEditToggle}
            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition"
          >
            <FaRegEdit className="h-5 w-5 text-white" />
          </button>
        </div>
        {isEditing && (
          <div className="mb-4">
            <label className="block text-gray-400">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
          </div>
        )}
        <div className="w-full mt-4">
          <div className="mb-4">
            <label className="block text-gray-400">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border bg-slate-500 border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p>{userDetails.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border bg-slate-500 border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p>{userDetails.email}</p>
            )}
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-400">Teaching Classes</label>
            <ul className="list-disc list-inside">
              {teachingClasses.map((cls, index) => (
                <li key={index}>{cls}</li>
              ))}
            </ul>
          </div> */}
          {/* <div className="mb-4">
            <label className="block text-gray-400">Enrolled Classes</label>
            <ul className="list-disc list-inside">
              {enrolledClasses.map((cls, index) => (
                <li key={index}>{cls}</li>
              ))}
            </ul>
          </div> */}
          {isEditing && (
            <button
              onClick={handleSave}
              className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
