import React, { useEffect, useState } from 'react';
import useClassStore from '@/store/classStore';
import { BASE_URL } from '@/utils/constants';
import Avatar from '@mui/material/Avatar';
import { useParams } from 'react-router-dom';

function AdminClassMembers() {
    function stringToColor(string){
        let hash = 0;
        let i;
  
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
  
        let color = '#';
  
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
  
        return color;
      }
  
      function stringAvatar(name) {
        console.log("Name:", name);
        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1];
        console.log("First name:", firstName);
        console.log("Last name:", lastName);
        
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`,
        };
      }
  
  
  
    const {classId}=useParams()
    const { currentClass, classMembers, userRoleInClass, fetchClassMembers, removeStudents,fetchClassroomById } = useClassStore((state) => ({
      currentClass: state.currentClass,
      classMembers: state.classMembers,
      userRoleInClass: state.userRoleInClass,
      fetchClassMembers: state.fetchClassMembers,
      removeStudents: state.removeStudents,
      fetchClassroomById:state.fetchClassroomById,
    }));
  
    console.log(classMembers.students);
  
    const [selectedStudents, setSelectedStudents] = useState([]);
  
    useEffect(() => {

        fetchClassMembers(classId);
        fetchClassroomById(classId)
    
    }, [    ]);
  
    const handleSelectStudent = (studentId) => {
      setSelectedStudents((prev) =>
        prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
      );
    };
  
    const handleSelectAll = () => {
      if (selectedStudents.length === classMembers.students.length) {
        setSelectedStudents([]);
      } else {
        setSelectedStudents(classMembers.students.map((student) => student.id));
      }
    };
  
    const handleRemoveStudents = () => {
      removeStudents(currentClass.id, selectedStudents);
    };
  return (
    <>
      <div>
      <div className="p-6 bg-gray-800 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Class People</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Teacher</h2>
        {classMembers.teacher && (
          <div className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg shadow-lg">
            {classMembers.teacher.user.profile_pic? <img className="w-16 h-16 rounded-full object-cover" src={classMembers.teacher.user.profile_pic} alt={classMembers.teacher.user.name} />
            : <Avatar {...stringAvatar(classMembers.teacher.user.name)} />}
            
            <div>
              <p className="text-xl font-medium">{classMembers.teacher.user.name}</p>
              <p className="text-gray-400">{classMembers.teacher.user.email}</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Students</h2>

          {/* <div className="flex items-center mb-4 space-x-4">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={selectedStudents.length === classMembers.students.length}
              onChange={handleSelectAll}
            />
            <label className="text-lg">Select All</label>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={handleRemoveStudents}
            >
              Remove Selected Students
            </button>
          </div> */}
    
        <ul className="space-y-4">
          {classMembers.students.map((student) => (
            <div>
            <li key={student.id} className="flex items-center justify-between  p-4 ">
              <div className="flex items-center space-x-4">

                {/* <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleSelectStudent(student.id)}
                /> */}

                {student.user.profile_pic ? <img className="w-12 h-12 rounded-full object-cover" src={student.user.profile_pic} alt={student.user.name} />
                : <Avatar {...stringAvatar(student.user.name)} />
                }
                
                <div>
                  <p className="text-lg font-medium">{student.user.name}</p>
                  <p className="text-gray-400">{student.user.email}</p>
                </div>
              </div>
              
              
            </li>
            <hr className='text-white mt-2 '/>
            </div>
            
          ))}
          
        </ul>
      </div>
    </div>

 </div>

    </>
  )
}

export default AdminClassMembers
