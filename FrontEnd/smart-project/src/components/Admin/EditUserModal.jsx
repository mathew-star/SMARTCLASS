import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Avatar from '@mui/material/Avatar';

Modal.setAppElement('#root'); // Ensure the modal is properly attached to the root element

const EditUserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile_pic: '',
  });
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_pic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    if (profilePicFile) {
      data.append('profile_pic', profilePicFile);
    }
    data.append('id', user.id);
    onSave(data);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Edit User" className="flex px-24 py-24  items-center justify-center">
    <div className="bg-[#151A2C] text-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl mb-6">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-2">Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleProfilePicChange} className="w-full p-2 rounded bg-gray-700 text-white" />
          {formData.profile_pic && <Avatar src={formData.profile_pic} alt="Profile Picture" className="mt-4" />}
        </div>
        <div className="flex justify-end space-x-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </form>
    </div>
  </Modal>
  );
};

export default EditUserModal;
