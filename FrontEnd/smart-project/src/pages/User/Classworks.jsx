import classApi from '@/api/classroomApi';
import CreateTopicModal from '@/components/User/CreateTopicModal';
import TeachersAssignmentList from '@/components/User/TeachersAssignmentList';
import TopicDropdown from '@/components/User/TopicDropdown';
import useClassStore from '@/store/classStore';
import React, { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';


function Classworks() {
  const userRoleInClass = useClassStore((state) => state.userRoleInClass);

  const isTeacher= userRoleInClass.role==='teacher'? true:false;
  const isStudent= userRoleInClass.role==='student'? true:false;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate()
  const { classId } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [assignments, setAssignments] = useState([]);

  const { currentClass } = useClassStore((state) => ({
    currentClass: state.currentClass,
  }));

  const fetchTopics = async () => {
    const data = await classApi.fetchTopic(currentClass.id);
    console.log(data)
    setTopics(data.map(topic => ({ value: topic.id, label: topic.title })));


  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  
  const fetchAssignments = async () => {
    if (currentClass) {
      const data = await classApi.fetchAssignments(currentClass.id);
      const formattedData = data.map(assignment => ({
        ...assignment,
        formatted_dates: { 
          created_at: formatDate(assignment.created_at),
          due_date: assignment.due_date?formatDate(assignment.due_date):'',
        }
      }));
      setAssignments(formattedData);
    }
  };


  

  useEffect(() => {

      fetchTopics();
      fetchAssignments();

  }, [currentClass]);


  console.log(assignments)


  const toggleCreateDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSelect = (option) => {
    setSelectedTopic(option);
  };




  const handleAssignment = ()=>{
    navigate(`/c/${classId}/create-assignment`)
  }


  const handleTopicSave=async(title)=>{
    console.log("topic save")
    await classApi.createTopic(currentClass.id, title);
    fetchTopics()
  }

  return (
    <>
    {isTeacher &&(
      <div className='relative flex flex-wrap items-center justify-between'>
        <button onClick={toggleCreateDropdown}
            className="w-20 ms-10 bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >Create </button>
          {dropdownOpen && (
              <div className="absolute left-10 top-10  mt-2 w-48 bg-[#515670] rounded-md shadow-lg py-2">
                <button onClick={handleAssignment}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#0d9488]"
                >
                  Assignment
                </button>
                <button onClick={()=>setIsModalOpen(true)}  className="block w-full text-left px-4 py-2 text-white hover:bg-[#0d9488]">
                  Topic
                </button>
              </div>
            )}
         <div className="relative inline-block w-64">
         <div>
              {
                topics.length > 0 ?<TopicDropdown options={topics} placeholder="Select an option" onSelect={handleSelect} />
                :
                (<p>No topics</p>)
              }
              
            </div>
        </div>
        <div></div>

        <CreateTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleTopicSave}
      />
      </div>
    )}

    {isTeacher&&(
      <div className='flex justify-center items-center mt-20 h-full'>
        <TeachersAssignmentList assignments={assignments} />
      </div>
    )}

    
    


    </>
  )
}

export default Classworks
