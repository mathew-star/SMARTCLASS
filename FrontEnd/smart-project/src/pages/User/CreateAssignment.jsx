import React, { useState, useEffect } from 'react';
import { MdClose, MdOutlineDriveFolderUpload } from "react-icons/md";
import { FaYoutube } from "react-icons/fa6";
import SelectStudentsModal from '@/components/User/SelectStudentsModal';
import TopicDropdown from '@/components/User/TopicDropdown';
import useClassStore from '@/store/classStore';
import { BASE_URL } from '@/utils/constants';
import axios from 'axios';
import classApi from '@/api/classroomApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CreateAssignment() {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [topics, setTopics] = useState([]);


  const { currentClass } = useClassStore((state) => ({
    currentClass: state.currentClass,
  }));

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await classApi.fetchTopic(currentClass.id);
      setTopics(data.map(topic => ({ value: topic.id, label: topic.title })));
    };

    if (currentClass) {
      fetchTopics();
    }
  }, [currentClass]);

  const handleSave = (students) => {
    setSelectedStudents(students);
  };

  const handleSelect = (option) => {
    setSelectedTopic(option);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleFileRemove = (fileToRemove) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('instructions', instructions);
    formData.append('due_date', dueDate);
    formData.append('points', totalPoints);
    formData.append('classroom', currentClass.id);
    formData.append('topic', selectedTopic ? selectedTopic.value : '');
    
    selectedStudents.forEach(studentId => {
      formData.append('assigned_students[]', studentId);
  });

  // Append each file individually
  files.forEach(file => {
      formData.append('files', file);
  });





    try {
      const response = await classApi.createAssignment(currentClass.id,formData);
      toast.success('Assignment created successfully');
      console.log('Assignment created successfully:', response.data);
    } catch (error) {

      console.error('Error creating assignment:');
      toast.error('Failed to create');
    }
  };






  return (
    <>
      <div className='flex flex-row flex-wrap justify-between text-white'>
        <div className='flex flex-col px-8 w-[40%] h-full'>
          <div className='rounded bg-[#172231] p-8'>
            <form className='flex flex-col'>
              <input className='shadow appearance-none border rounded mb-8 w-full py-2 px-3 bg-[#273445] leading-tight focus:outline-none focus:shadow-outline' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
              <textarea rows={4} cols={9} className='py-2 px-3 bg-[#273445] rounded' value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Instructions" />

              <div className='mt-4'>
                  {files.map((file, index) => (
                    <div key={index} className='flex justify-between items-center bg-[#273445] p-2 rounded mt-2'>
                      <p className='text-white'>{file.name}</p>
                      <MdClose className='text-white cursor-pointer' onClick={() => handleFileRemove(file)} />
                    </div>
                  ))}
                </div>

              <div className='rounded bg-[#172231] p-4 mt-5'>
                <div className='flex'>
                  <p className='text-lg font-semibold mt-2'>Attach</p>
                  <div className='flex flex-col'>
                    <label htmlFor="file-upload" className='cursor-pointer'>
                      <MdOutlineDriveFolderUpload className='w-10 h-10 ms-10' />
                      <p className='ms-6'>Upload file</p>
                    </label>
                    <input id="file-upload" type="file" className='hidden' onChange={handleFileChange} />
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>

        <div className='flex flex-col p-8 bg-[#172231] w-[35%] h-full rounded'>
          <div className='flex flex-row justify-between'>
            <p>For </p>
            <div>
              <button onClick={() => setIsModalOpen(true)} className='w-40 ms-1 bg-[#4977ac] text-white text-lg font-normal py-2 rounded-lg hover:bg-blue-700 transition'>Select Students</button>
            </div>
          </div>
          <hr className='text-white bg-white mt-10 mb-8' />

          <div className='flex flex-row justify-between'>
            <p>Topic</p>
            <div>
              {
                topics.length > 0 ?<TopicDropdown options={topics} placeholder="Select an option" onSelect={handleSelect} />
                :
                (<p>No topics</p>)
              }
              
              {selectedTopic && (
                <div className="mt-4 text-center text-gray-700">
                  <p>Selected: {selectedTopic.label}</p>
                </div>
              )}
            </div>
          </div>
          <hr className='text-white bg-white mt-10 mb-8' />

          <div className='flex flex-row justify-between'>
            <p>Due Date </p>
            <input className='shadow bg-[#273445] mb-8 appearance-none border rounded w-1/3 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline' type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <hr className='text-white bg-white mt-10 mb-8' />

          <div className='flex flex-row justify-between'>
            <p>Points </p>
            <input className='shadow bg-[#273445] mb-8 appearance-none border rounded w-1/4 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline' type="number" value={totalPoints} onChange={(e) => setTotalPoints(e.target.value)} placeholder="Total Points" />
          </div>

          <button onClick={handleSubmit} className="w-20 ms-1 bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition" type="submit">Assign</button>
        </div>
      </div>

      <SelectStudentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

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
  );
}

export default CreateAssignment;
