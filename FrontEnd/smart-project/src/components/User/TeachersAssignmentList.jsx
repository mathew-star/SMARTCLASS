import useClassStore from '@/store/classStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

function TeachersAssignmentList({ assignments }) {
  const navigate = useNavigate();
  const { currentClass } = useClassStore((state) => ({
    currentClass: state.currentClass,
  }));

  const handleClick = (assignmentId) => {
    navigate(`/c/${currentClass.id}/t/${assignmentId}/assignment_details/`);
  };

  const assignmentsWithoutTopic = assignments.filter(assignment => !assignment.topic);
  const assignmentsByTopic = assignments.reduce((acc, assignment) => {
    if (assignment.topic) {
      if (!acc[assignment.topic.title]) {
        acc[assignment.topic.title] = [];
      }
      acc[assignment.topic.title].push(assignment);
    }
    return acc;
  }, {});


  return (
    <div className='mt-4 w-[70%] px-4 py-4'>
      {assignmentsWithoutTopic.length > 0 && (
        <>
          <h2 className='text-2xl text-white mb-2'></h2>
          <ul className='space-y-4'>
            {assignmentsWithoutTopic.map((assignment) => (
              <li
                onClick={() => handleClick(assignment.id)}
                key={assignment.id}
                className='flex items-center p-4 border-b w-[80%] bg-[#1F2135] cursor-pointer rounded-lg hover:bg-[#2a2c4a] transition duration-300'
              >
                <FaClipboardList className='w-6 h-6 text-blue-500 mr-4' />
                <div className='flex flex-col'>
                  <span className='text-lg font-semibold text-white'>{assignment.title}</span>
                  <span className='text-sm text-gray-400'>Posted on {assignment.formatted_dates.created_at}</span>
                  <span className='text-sm text-gray-400'>{assignment.formatted_dates.due_date ? assignment.formatted_dates.due_date : "No due date"}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {Object.keys(assignmentsByTopic).map(topic => (
        <div key={topic} className='mt-8'>
          <h2 className='text-3xl text-white mb-2  font-semibold'>{topic}</h2>
          <ul className='space-y-4'>
            {assignmentsByTopic[topic].map((assignment) => (
              <li
                onClick={() => handleClick(assignment.id)}
                key={assignment.id}
                className='flex items-center p-4 border-b w-[80%] bg-[#1F2135] cursor-pointer rounded-lg hover:bg-[#2a2c4a] transition duration-300'
              >
                <FaClipboardList className='w-6 h-6 text-blue-500 mr-4' />
                <div className='flex flex-col'>
                  <span className='text-lg font-semibold text-white'>{assignment.title}</span>
                  <span className='text-sm text-gray-400'>Posted on {assignment.formatted_dates.created_at}</span>
                  <span className='text-sm text-gray-400'>{assignment.formatted_dates.due_date ? assignment.formatted_dates.due_date : "No due date"}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TeachersAssignmentList;
