import useClassStore from '@/store/classStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';

function ViewStudenworksList({ assignments }) {
  const navigate = useNavigate();
  const { currentClass } = useClassStore((state) => ({
    currentClass: state.currentClass,
  }));

  const handleClick = (assignmentId) => {
    navigate(`/class/${currentClass.id}/assignment/${assignmentId}/details/`);
  };



  return (
    <div className="mt-4 w-[70%] px-4 py-4">
      <div className="mt-8">
        <h2 className="text-2xl text-white mb-2">Assignments</h2>
        <ul className="space-y-4">
          {assignments.map((assignment) => (
            <li
              onClick={() => handleClick(assignment.id)}
              key={assignment.id}
              className="flex items-center p-4 border-b w-[80%] relative bg-[#1F2135] z-50 cursor-pointer rounded-lg hover:bg-[#2a2c4a] transition duration-300"
            >
              <FaClipboardList className="w-6 h-6 text-blue-500 mr-4" />
              <div className="flex flex-row justify-around items-center">
                <div className=' flex flex-col'>
                    <span className="text-lg font-semibold text-white">{assignment.title}</span>
                    <span className="text-sm text-gray-400">Posted on {assignment.formatted_dates.created_at}</span>
                    <span className="text-sm text-gray-400">{assignment.formatted_dates.due_date ? assignment.formatted_dates.due_date : "No due date"}</span>
                </div>
                <div className='absolute right-0 me-5'>
                {assignment.submission_files.length > 0 ? (
                            
                                <div>
                                    <p className='text-xl font-medium text-green-700'>{assignment.submission_status}</p>
                                    {/* <p>Submitted At: {new Date(submission.submitted_at).toLocaleDateString()}</p> */}
                                    <p>Points: {assignment.submission_points}/{assignment.points}</p>
                                </div>
                            
                        ) : (
                            <p className='text-lg font-medium text-red-600'>Not submitted </p>
                        )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default React.memo(ViewStudenworksList);
