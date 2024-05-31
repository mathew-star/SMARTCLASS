import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';
import authApi from '@/api/authApi';
import { BASE_URL } from '@/utils/constants';
import Avatar from '@mui/material/Avatar';
import EditUserModal from '../../components/Admin/EditUserModal'; // Import the modal component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authApi.fetchUsers();
        const filtered_data = data.filter((user) => !user.is_superuser);
        setUsers(filtered_data);
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await authApi.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      const updatedUser = await authApi.updateUser(formData);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleBlock = async (userId) => {
    try {
      await authApi.blockUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, is_blocked: true } : user))
      );
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await authApi.unblockUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, is_blocked: false } : user))
      );
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] text-white p-8">
      <h1 className="text-3xl mb-6">Users</h1>
      <div className="bg-[#151A2C] p-6 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="p-4">Profile</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="p-4">
                  {user.profile_pic ? (
                    <Avatar
                      alt={user.name}
                      src={user.profile_pic}
                      sx={{ width: 50, height: 50 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 50, height: 50 }} src="/broken-image.jpg" />
                  )}
                </td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mr-2"
                  >
                    <FaTrash />
                  </button>
                  {user.is_blocked ? (
                    <button
                      onClick={() => handleUnblock(user.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      <FaUnlock />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlock(user.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                      <FaLock />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <EditUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          user={currentUser}
        />
      )}
    </div>
  );
};

export default Users;
