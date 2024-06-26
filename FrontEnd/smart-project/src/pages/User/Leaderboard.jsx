import React, { useEffect, useState } from 'react';
import useClassStore from '@/store/classStore';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '@/utils/constants';
import Avatar from '@mui/material/Avatar';
import { GiTrophy } from "react-icons/gi";
import classApi from '@/api/classroomApi';


const Leaderboard = () => {
  function stringToColor(string) {
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

  const leaderboard = useClassStore((state) => state.leaderboard);
  const [assignments,setAssignments]=useState([])
  const fetchUpdateLeaderboard = useClassStore((state) => state.fetchUpdateLeaderboard);
  const { classId } = useParams();

  useEffect(() => {
    fetchUpdateLeaderboard(classId);
  }, [classId, fetchUpdateLeaderboard]);


  const fetchAssignments = async () => {
    if (currentClass) {
      const data = await classApi.fetchAssignments(classId);
      setAssignments(data);
    }
  };


  // Sort leaderboard entries based on points in descending order
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.total_points - a.total_points);


  return (
<>

          <>
              <div className="container mx-auto p-6">
      {sortedLeaderboard && sortedLeaderboard.length > 0 ? (
        <div className="bg-gray-800 shadow-md text-white rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Leaderboard</h2>
          <ul className="space-y-6">
            {sortedLeaderboard.map((entry, index) => (
              <li key={index} className={`flex justify-between p-4 rounded-lg shadow ${index === 0 ? 'bg-yellow-400' : 'bg-gray-700'}`}>
                <div className="relative flex items-center space-x-4">
                  {entry.user.profile_pic ? (
                    <img
                      className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                      src={entry.user.profile_pic}
                      alt={entry.user.name}
                    />
                  ) : (
                    <Avatar {...stringAvatar(entry.user.name)} className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400" />
                  )}
                  <div>
                    <p className={`text-lg font-medium ${index === 0 ? 'text-gray-800' : 'text-white'}`}>{entry.user.name}</p>
                  </div>
                  <div className="flex items-center space-x-4 ml-auto">
                    <p className={`font-bold ${index === 0 ? 'text-gray-800' : 'text-yellow-400'}`}>{entry.total_assignments} assigned</p>
                    <span className="text-gray-400 mx-2">|</span>
                    <p className={`font-bold ${index === 0 ? 'text-gray-800' : 'text-yellow-400'}`}>{entry.completed_assignments} completed</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <p className={`text-2xl font-bold ${index === 0 ? 'text-gray-800' : 'text-white'}`}>{entry.total_points} points</p>
                  {index === 0 && (
                    <GiTrophy className='ms-6 me-3 text-black w-10 h-10'/>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-2xl font-medium text-gray-400">No data!</p>
        </div>
      )}
    </div>
          
          </>




</>
  );
};

export default Leaderboard;
