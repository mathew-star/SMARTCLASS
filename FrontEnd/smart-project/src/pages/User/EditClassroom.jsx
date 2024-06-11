import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classApi from '@/api/classroomApi';
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditClassroom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    sections: '',
    description: '',
    banner_image: null,
  });

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const data = await classApi.fetchClassroomById(classId);
        setClassroom(data);
        setFormData({
          title: data.title,
          sections: data.sections,
          description: data.description,
          banner_image: null,
        });
      } catch (error) {
        console.error('Error fetching classroom details:', error);
      }
    };
    fetchClassroom();
  }, [classId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, banner_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append('title', formData.title);
    updatedData.append('sections', formData.sections);
    updatedData.append('description', formData.description);
    if (formData.banner_image) {
      updatedData.append('banner_image', formData.banner_image);
    }

    try {
      await classApi.updateClassroom(classId, updatedData);
      navigate(`/c/${classId}/stream`);
    } catch (error) {
      console.error('Error updating classroom:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await classApi.deleteClassroom(classId);
      navigate(`/h`);
    } catch (error) {
      console.error('Error deleting classroom:', error);
    }
  };

  if (!classroom) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Classroom</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg bg-[#1f2230] "
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Sections</label>
          <textarea
            name="sections"
            value={formData.sections}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg bg-[#1f2230]"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg bg-[#1f2230]"
          />
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Banner Image</label>
          <input
            type="file"
            name="banner_image"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-lg bg-[#1f2230]"
          />
        </div>
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save Changes</Button>
      </form>
      <hr className="my-8" />
      <Button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete Classroom</Button>

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
    </div>
  );
};

export default EditClassroom;
