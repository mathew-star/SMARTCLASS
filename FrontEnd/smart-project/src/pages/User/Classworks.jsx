import useClassStore from '@/store/classStore';
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { IoMdAdd } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';


function Classworks() {
  const userRoleInClass = useClassStore((state) => state.userRoleInClass);

  const isTeacher= userRoleInClass.role==='teacher'? true:false;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate()
  const { classId } = useParams();



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

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];


  const handleAssignment = ()=>{
    navigate(`/c/${classId}/create-assignment`)
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
                <button onClick={()=>setIsJoinModalOpen(true)}  className="block w-full text-left px-4 py-2 text-white hover:bg-[#0d9488]">
                  Topic
                </button>
              </div>
            )}
         <div className="relative inline-block w-64">
         <div
            onClick={toggleDropdown}
            className="flex items-center justify-between bg-[#7b9ecf] text-white px-4 py-2 rounded-md cursor-pointer"
          >
          <span>{selectedOption ? selectedOption.label : "All"}</span>
          <FaChevronDown />
          </div>
          {isOpen && (
            <ul className="absolute w-full bg-[#6e7eab] text-white mt-2 rounded-md shadow-lg z-10">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-2  hover:bg-[#4686e6] cursor-pointer"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div></div>
      </div>
    )}

    
     
    </>
  )
}

export default Classworks
