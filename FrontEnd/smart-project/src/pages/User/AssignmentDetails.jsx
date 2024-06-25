import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useMatch } from 'react-router-dom';
import { MdClose, MdOutlineDriveFolderUpload } from "react-icons/md";
import SelectStudentsModal from '@/components/User/SelectStudentsModal';
import TopicDropdown from '@/components/User/TopicDropdown';
import useClassStore from '@/store/classStore';
import classApi from '@/api/classroomApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditSelectStudentsModal from '@/components/User/EditSelectStudentsModal';
import FilePreviewModal from '@/components/User/FilePreviewModal';

function AssignmentDetails() {
  const { classId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fetchtopicId,setfetchtopicId]= useState(null)

  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const data = await classApi.fetchAssignmentDetails(classId, assignmentId);
        setAssignment(data);
        setTitle(data.title);
        setInstructions(data.instructions);
        const formattedDueDate = new Date(data.due_date).toISOString().split('T')[0];
        setDueDate(formattedDueDate);
        setTotalPoints(data.points);
        setfetchtopicId(data.topic);
        setSelectedStudents(data.assigned_students || []);
        setFiles(data.files || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        setLoading(false);
      }
    };

    const fetchTopics = async () => {
      try {
        const topicsData = await classApi.fetchTopic(classId);
        setTopics(topicsData.map(topic => ({ value: topic.id, label: topic.title })));
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    

    fetchAssignmentDetails();
    fetchTopics();
  }, [classId, assignmentId]);  



  useEffect(() => {
    if (topics.length > 0 && fetchtopicId !== null) {
      const filtered_topic = topics.find((topic) => topic.value === fetchtopicId);
      setSelectedTopic(filtered_topic || null);
    }
  }, [topics, fetchtopicId]);
  



  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const handleFileRemove = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      await classApi.deleteAssignment(classId, assignmentId);
      toast.success('Assignment deleted successfully!');
      navigate(`/c/${classId}/works`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment.');
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('instructions', instructions);
      formData.append('due_date', dueDate);
      formData.append('points', totalPoints);
      formData.append('topic', selectedTopic ? selectedTopic.value : '');
      files.forEach(file => formData.append('files', file));

      selectedStudents.forEach(studentId => {
        formData.append('assigned_students[]', studentId);
    });

      await classApi.updateAssignment(classId, assignmentId, formData);
      setIsEditing(false);
      toast.success('Assignment updated successfully!');
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error('Failed to update assignment.');
    }
  };

  const handleSelect = (selected) => {
    setSelectedTopic(selected);
  };

  const handleStudentsSave = (students) => {
    setSelectedStudents(students);
    setIsModalOpen(false);
  };

  const handleFilePreview = (file) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!assignment) {
    return <p>Assignment not found.</p>;
  }

  return (
    <>
      <div className='flex flex-row flex-wrap justify-between text-white'>
        <div className='flex flex-col px-8 w-[40%] h-full'>
          <div className='rounded bg-[#172231] p-8'>
            <form className='flex flex-col'>
              <input 
                disabled={!isEditing} 
                className='shadow appearance-none border rounded mb-8 w-full py-2 px-3 bg-[#273445] leading-tight focus:outline-none focus:shadow-outline' 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Title" 
              />
              <textarea 
                disabled={!isEditing} 
                rows={4} 
                cols={9} 
                className='py-2 px-3 bg-[#273445] rounded' 
                value={instructions} 
                onChange={(e) => setInstructions(e.target.value)} 
                placeholder="Instructions" 
              />

              <div className='mt-4'>
              {files &&(
                  <>
                  {files.map((file, index) => (
                  <div key={index} className='flex justify-between items-center bg-[#273445] p-2 rounded mt-2'>
                    {file.file && (
                      <p className='text-white cursor-pointer' onClick={() => handleFilePreview(file)}>{file.file ? file.file.split('/').pop() : file.name}</p>
                    )}
                    <MdClose className='text-white cursor-pointer' onClick={() => handleFileRemove(file)} />
                  </div>
                ))}
                  
                  </>

                )}
              </div>

              <div className='rounded bg-[#172231] p-4 mt-5'>
                <div className='flex'>
                  <p className='text-lg font-semibold mt-2'>Attach</p>
                  <div className='flex flex-col'>
                    <label htmlFor="file-upload" className={`cursor-pointer ${!isEditing && 'hidden'}`}>
                      <MdOutlineDriveFolderUpload className='w-10 h-10 ms-10' />
                      <p className='ms-6'>Upload file</p>
                    </label>
                    <input 
                      disabled={!isEditing} 
                      
                      id="file-upload" 
                      type="file" 
                      className='hidden' 
                      onChange={handleFileChange} 
                      multiple
                    />
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
              <button 
                onClick={() => setIsModalOpen(true)} 
                className='w-40 ms-1 bg-[#4977ac] text-white text-lg font-normal py-2 rounded-lg hover:bg-blue-700 transition'
              >
                Select Students
              </button>
            </div>
          </div>
          <hr className='text-white bg-white mt-10 mb-8' />

          <div className='flex flex-row justify-between'>
            <p>Topic</p>
            <div>
              {topics.length > 0 ? (
                <TopicDropdown
                options={topics}
                placeholder="Select an option"
                selectedTopic={selectedTopic}
                onSelect={handleSelect}
              />
              ) : (
                <p>No topics</p>
              )}

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
            <input 
              disabled={!isEditing} 
              className='shadow bg-[#273445] mb-8 appearance-none border rounded w-1/3 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline' 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
            />
          </div>
          <hr className='text-white bg-white mt-10 mb-8' />

          <div className='flex flex-row justify-between'>
            <p>Points </p>
            <input 
              disabled={!isEditing} 
              className='shadow bg-[#273445] mb-8 appearance-none border rounded w-1/4 py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline' 
              type="number" 
              value={totalPoints} 
              onChange={(e) => setTotalPoints(e.target.value)} 
              placeholder="Total Points" 
            />
          </div>

          <div className='flex justify-between'>
            {isEditing ? (
              <button 
                onClick={handleSave} 
                className="w-20 bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
            ) : (
              <button 
                onClick={handleEdit} 
                className="w-20 bg-green-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-green-700 transition"
              >
                Edit
              </button>
            )}
            <button 
              onClick={handleDelete} 
              className="w-20 bg-red-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <EditSelectStudentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleStudentsSave}
        selectedStudents={selectedStudents}
      />

      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        file={selectedFile}
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

export default React.memo(AssignmentDetails);
