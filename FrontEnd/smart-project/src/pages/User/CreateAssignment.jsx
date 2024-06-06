import TopicDropdown from '@/components/User/TopicDropdown';
import useClassStore from '@/store/classStore';
import React, { useState } from 'react'
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { FaYoutube } from "react-icons/fa6";

function CreateAssignment() {
    const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const { createAssignment, currentClass } = useClassStore((state) => ({
    createAssignment: state.createAssignment,
    currentClass: state.currentClass,
  }));
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log('Selected option:', option);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAssignment = {
      title,
      instructions,
      due_date: dueDate,
      total_points: totalPoints,
      classroom: currentClass.id,
      topic: selectedTopicId, // Ensure you handle topic selection
    };

    await createAssignment(newAssignment);
    // Reset form fields or provide feedback
  };

  return (
    <>
    <div className='flex flex-row flex-wrap justify-between'>
        <div className='flex flex-col px-8 w-[40%] h-full'>
            <div className='rounded bg-[#172231] p-8'>
                <div className='flex flex-col' onSubmit={handleSubmit}>
                    <input className='shadow appearance-none border rounded mb-8 w-full py-2 px-3 text-black bg-[#273445] leading-tight focus:outline-none focus:shadow-outline' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                    <textarea rows={4} cols={9} className='py-2 px-3 text-black bg-[#273445] rounded'  value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Instructions" />
                    
                   
                </div>

                <div className='mt-5'>
                    <p>Files here ...</p>
                </div>
            </div>

            <div className='rounded bg-[#172231] p-4 mt-5'>
                
                <div className='flex'>
                <p className='text-lg font-semibold mt-1'>Attach</p>

                <div className='flex flex-col'>
                    <MdOutlineDriveFolderUpload  className='w-10 h-10 ms-10'/>
                    <p className='ms-6'>Upload file</p>
                </div>

                <div className='flex flex-col'>
                    <FaYoutube className='w-10 h-10 ms-20 text-red-600'/>
                    <p className='ms-14 '>Youtube link</p>
                </div>

                </div>
            </div>
        </div>

        <div className='flex flex-col p-8 bg-[#172231] w-[35%] h-full rounded'>


        <div className='flex flex-row justify-between'>
            <p>Topic</p>

            <div>
                <TopicDropdown 
                options={options} 
                placeholder="Select an option" 
                onSelect={handleSelect} 
                />
                {selectedOption && (
                <div className="mt-4 text-center text-gray-700">
                    <p>Selected: {selectedOption.label}</p>
                </div>
                )}
            </div>
            
        </div>
        <hr className='text-white bg-white mt-10 mb-8' />

        <div className='flex flex-row justify-between'>
            <p>Due Date </p>

            <input className='shadow bg-[#273445] mb-8 appearance-none border rounded w-1/3  py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline' type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <hr className='text-white bg-white mt-10 mb-8' />

        <div className='flex flex-row justify-between'>
            <p>Points </p>
            <input className='shadow bg-[#273445] mb-8 appearance-none border rounded w-1/4  py-2  px-3 text-white leading-tight focus:outline-none focus:shadow-outline' type="number" value={totalPoints} onChange={(e) => setTotalPoints(e.target.value)} placeholder="Total Points" />
        </div>

        

        <button className="w-20 ms-1  bg-blue-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-blue-700 transition" type="submit">Assign</button>
        </div>
    </div>
   
    </>
  );
}

export default CreateAssignment
