import classApi from '@/api/classroomApi';
import { BASE_URL } from '@/utils/constants';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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


  const formatData= useCallback((dateString)=>{
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  },[])


  const { classId, assignmentId } = useParams();
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSubmission, setStudentSubmission] = useState(null);
  const [dueDate , setDueDate]= useState(null)
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchDetails = async (classId, assignmentId) => {
      try {
        console.log("useEffect");
        const assignmentDetails = await classApi.fetchStudentsdetails(classId, assignmentId);
        setAssignmentDetails(assignmentDetails);
        setDueDate(formatData(assignmentDetails.due_date))
        // Extract students from the assignment details
        const assignedStudents = assignmentDetails.assigned_students || [];
        setStudents(assignedStudents);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
      }
    };
    fetchDetails(classId, assignmentId);



  }, []);
  console.log(assignmentDetails)


  const fetchStudentSubmission = async (studentId) => {
    try {
      const submission = await classApi.FetchStudentSubmission(classId, assignmentId, studentId);
      setStudentSubmission(submission);
      setPoints(studentSubmission.points)
    } catch (error) {
      console.error('Error fetching student submission:', error);
    }
  };



  const submitPoints = async () => {
    try {
      if(points>assignmentDetails.points){
        toast.error("Submitted point is greater and Total Point")
      }
      else{
        await classApi.SubmitPoints(classId, assignmentId, selectedStudent.id, points);
        toast.success('Points updated!');
        fetchStudentSubmission(selectedStudent.id);
        setPoints(studentSubmission.points)
      }
      // Reset the points input field
    } catch (error) {
      console.error('Error submitting points:', error);
      toast.error("Error submitting points !")
    }
  };


  return (
    <> 
    {assignmentDetails?
    (
      <div className="">

      <div className="w-full pr-4">
        {/* Display assignment details */}
        {assignmentDetails && (
          <div>
            <h1 className="text-2xl font-bold">{assignmentDetails.title}</h1>
            <p>Due Date: {dueDate}</p>
            {/* Add other assignment details here */}
          </div>
        )}
      </div>
      
    </div>
    ):(
      <p>No data available..!</p>
    )
    }
        <hr className='mt-4'/>
    {students&&(
        <div className='flex flex-row'>
        <div className=" pl-4 border-r-2 w-[30%] py-6 h-full  ">
            {/* Display list of students */}
            <h2 className="text-xl font-bold">Students</h2>
            <ul>
            {students.map((student) => (
                    <li onClick={() => {
                      setSelectedStudent(student);
                      fetchStudentSubmission(student.id);
                    }}  key={student.id} className="flex items-center justify-between p-4 hover:bg-[#272e4e] cursor-pointer">
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
    
                        <div>
                          
                        </div>
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
    
          <div className='p-8'>
                  
            
          </div>
          <div>
          {!studentSubmission && (
                    <p className='mt-10 text-xl text-red-200'>No submission made !</p>
                  )}
          </div>
          <div>
            {selectedStudent && studentSubmission && (
            <div>
              <div className='flex flex-row  items-center p-4'>
    
              <div className='me-10'>
                <h2 className='text-3xl font-medium '>{selectedStudent.user.name}'s Submission</h2>
              </div>
    
              <div className='ms-20'>
                <input
                  type="number"
                  value={points}
                  max={assignmentDetails.points}
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                  className='bg-[#1F2937] w-12 h-8 border-b-2 text-xl'
                /> 
                <span className='text-xl'>/{assignmentDetails.points}</span>
                <Button className="ms-10 bg-[#2e65bd] text-white text-lg font-semibold py-2 rounded-lg hover:bg-green-700 transition" onClick={submitPoints}>Return</Button>
              </div>
              </div>
              {/* Display submission details */}
              {/* You can add code here to display submission details */}
              <div className='mt-10'>
                            {studentSubmission.files.map((file, index) => (
                                <div key={index} className='flex justify-between items-center bg-[#273445] p-2 rounded mt-2'>
                                    <a
                                            href={`${BASE_URL}${file.file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white cursor-pointer"
                                        >
                                            {file.file ? file.file.split('/').pop() : file.name}
                                        </a>
                                </div>
                            ))}
                </div>
              
            </div>
          )}
          </div>
    
        </div>


    )}

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

export default React.memo(StudentsWorks);
