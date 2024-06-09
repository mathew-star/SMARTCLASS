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

  return (
    <div className='mt-4 w-[70%] px-4 py-4'>
      {assignments.length > 0 ? (
        <ul className='space-y-4'>
          {assignments.map((assignment) => (
            <li
              onClick={() => handleClick(assignment.id)}
              key={assignment.id}
              className='flex items-center p-4 border-b w-[80%] bg-[#1F2135] cursor-pointer rounded-lg hover:bg-[#2a2c4a] transition duration-300'
            >
              <FaClipboardList className='w-6 h-6 text-blue-500 mr-4' />
              <div className='flex flex-col'>
                <span className='text-lg font-semibold text-white'>{assignment.title}</span>
                <span className='text-sm text-gray-400'>Posted on {(assignment.formatted_dates.created_at)}</span>
                <span className='text-sm text-gray-400'>{(assignment.formatted_dates.due_date)?(assignment.formatted_dates.due_date):"No due date"}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-white'>No assignments</p>
      )}
    </div>
  );
}

export default TeachersAssignmentList;
