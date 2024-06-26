import classApi from '@/api/classroomApi';
import CreateTopicModal from '@/components/User/CreateTopicModal';
import StudentAssignmentList from '@/components/User/StudentAssignmentList';
import TeachersAssignmentList from '@/components/User/TeachersAssignmentList';
import TopicDropdown from '@/components/User/TopicDropdown';
import Loader from '@/components/ui/Loader';
import useClassStore from '@/store/classStore';
import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';

function Classworks() {
  const fetchUserRoleInClass = useClassStore((state) => state.fetchUserRoleInClass);
  const fetchClassroomById = useClassStore((state) => state.fetchClassroomById);

  const { classId } = useParams();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [studentAssignments, setStudentAssignments] = useState([]);

  const currentClass = useClassStore((state) => state.currentClass);
  const userRoleInClass = useClassStore((state) => state.userRoleInClass);

  const fetchTopics = async () => {
    try {
      const data = await classApi.fetchTopic(classId);
      setTopics(data.map(topic => ({ value: topic.id, label: topic.title })));
    } catch (error) {
      console.error('Failed to fetch topics:');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const fetchAssignments = async () => {
    try {
      const data = await classApi.fetchAssignments(classId);
      const formattedData = data.map(assignment => ({
        ...assignment,
        formatted_dates: {
          created_at: formatDate(assignment.created_at),
          due_date: assignment.due_date ? formatDate(assignment.due_date) : '',
        },
      }));
      setAssignments(formattedData);
    } catch (error) {
      console.error('Failed to fetch assignments:');
    }
  };

  const fetchStudentAssignments = async () => {
    try {
      const data = await classApi.fetchStudentAssignments(classId);
      const formattedData = data.map(assignment => ({
        ...assignment,
        formatted_dates: {
          created_at: formatDate(assignment.created_at),
          due_date: assignment.due_date ? formatDate(assignment.due_date) : '',
        },
      }));
      setStudentAssignments(formattedData);
    } catch (error) {
      console.error('Failed to fetch student assignments:', error);
    }
  };

  useEffect(() => {
    fetchClassroomById(classId);
    fetchUserRoleInClass(classId);
  }, [classId, fetchClassroomById, fetchUserRoleInClass]);

  useEffect(() => {
    if (userRoleInClass) {
      fetchTopics();
      if (userRoleInClass.role === 'teacher') {
        fetchAssignments();
      } else if (userRoleInClass.role === 'student') {
        fetchStudentAssignments();
      }
    }
  }, [userRoleInClass]);

  if (!userRoleInClass || !currentClass) {
    return <Loader />;
  }

  const toggleCreateDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleAssignment = () => {
    navigate(`/c/${classId}/create-assignment`);
  };

  const handleTopicSave = async (title) => {
    await classApi.createTopic(currentClass.id, title);
    fetchTopics();
  };

  return (
    <>
      {userRoleInClass.role === 'student' && (
        <>
          <div>
            <button onClick={() => navigate(`/c/${classId}/view-student_works`)}
              className="w-28 ms-10 bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Works
            </button>
          </div>
        </>
      )}

      {userRoleInClass.role === 'teacher' && (
        <>
          <div className='relative flex flex-wrap items-center justify-between'>
            <button onClick={toggleCreateDropdown}
              className="w-20 ms-10 bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create
            </button>
            {dropdownOpen && (
              <div className="absolute left-10 top-10 mt-2 w-48 bg-[#515670] rounded-md shadow-lg py-2">
                <button onClick={handleAssignment}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#0d9488]"
                >
                  Assignment
                </button>
                <button onClick={() => setIsModalOpen(true)} className="block w-full text-left px-4 py-2 text-white hover:bg-[#0d9488]">
                  Topic
                </button>
              </div>
            )}
            <div className="relative inline-block w-64">
              {topics.length > 0 ? <TopicDropdown options={topics} placeholder="Select an option" onSelect={setSelectedTopic} /> : <p></p>}
            </div>
            <CreateTopicModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleTopicSave}
            />
          </div>
          <div className='flex justify-center items-center mt-20 h-full'>
            <TeachersAssignmentList assignments={assignments} />
          </div>
        </>
      )}

      {userRoleInClass.role === 'student' && (
        <>
          <div className='flex justify-center items-center mt-20 h-full'>
            <StudentAssignmentList assignments={studentAssignments} />
          </div>
        </>
      )}
    </>
  );
}

export default Classworks;
