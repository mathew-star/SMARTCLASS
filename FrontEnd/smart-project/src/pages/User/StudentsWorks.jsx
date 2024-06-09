import classApi from '@/api/classroomApi';
import { BASE_URL } from '@/utils/constants';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { Button } from "@/components/ui/button";

function StudentsWorks() {
  function stringToColor(string){
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`,
    };
  }


  const { classId, assignmentId } = useParams();
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchDetails = async (classId, assignmentId) => {
      try {
        // Fetch assignment details
        const assignmentDetails = await classApi.fetchStudentsdetails(classId, assignmentId);
        setAssignmentDetails(assignmentDetails);
        // Extract students from the assignment details
        const assignedStudents = assignmentDetails.assigned_students || [];
        setStudents(assignedStudents);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
      }
    };
    fetchDetails(classId, assignmentId);
  }, [classId, assignmentId]);

  return (
    <> 
    <div className="">

      <div className="w-full pr-4">
        {/* Display assignment details */}
        {assignmentDetails && (
          <div>
            <h1 className="text-2xl font-bold">{assignmentDetails.title}</h1>
            <p>Due Date: {assignmentDetails.due_date}</p>
            {/* Add other assignment details here */}
          </div>
        )}
      </div>
      
    </div>
        <hr className='mt-4'/>
    <div className='flex border-r-2 w-[40%] py-6 h-full'>
    <div className=" pl-4 ">
        {/* Display list of students */}
        <h2 className="text-xl font-bold">Students</h2>
        <ul>
        {students.map((student) => (
                <li key={student.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">

                    {student.user.profile_pic ? (
                      <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={`${BASE_URL}${student.user.profile_pic}`}
                        alt={student.user.name}
                      />
                    ) : (
                      <Avatar {...stringAvatar(student.user.name)} />
                    )}
                    <div>
                      <p className="text-lg font-medium">{student.user.name}</p>
                      <p className="text-gray-400">{student.user.email}</p>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </div>

    </div>
    </>
  );
}

export default StudentsWorks;
