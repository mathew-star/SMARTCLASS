import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classApi from '@/api/classroomApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from '@/store/authStore';
import { FaUser } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { BASE_URL } from '@/utils/constants';
import Avatar from '@mui/material/Avatar';
import { Button } from "@/components/ui/button";

const PrivateCommentSection = ({ assignmentId, Teacher_id,assignment }) => {
    

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const current_user = JSON.parse(localStorage.getItem('User'))
  console.log(current_user)




  const fetchComments = async (student_id) => {
    try {
      const data = await classApi.FetchPrivateComments(assignmentId, student_id,Teacher_id);
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        comment: newComment, 
      };
      const student = assignment.assigned_students.find(student => student.user.id === current_user.id);
      const response = await classApi.PostPrivateComments(assignmentId,student.id,Teacher_id ,data);
      setComments((prevComments) => [...prevComments, response]);
      fetchComments(student.id)
      setNewComment('');
      toast.success('Comment posted successfully!');
    } catch (error) {
      toast.error('Failed to post comment.');
    }
  };

  useEffect(() => {
    if (assignmentId && Teacher_id) {
        const current_student = assignment.assigned_students.find(student => student.user.id === current_user.id);
        fetchComments(current_student.id);
    }
  }, [assignmentId,Teacher_id]);

  return (
    <div className="comment-section mt-6">
      <ul className="space-y-4">
        {comments&&(
            <div>
            {comments.map((comment) => (
                <li key={comment.id} className="flex flex-col p-4   hover:bg-slate-700 border-gray-200 rounded" >
                    <div className='flex items-center'>
                        <div className='me-2 '>
                        {comment.user.profile_pic_url ? (
                            <img
                                className="w-12 h-12 rounded-full object-cover"
                                src={comment.user.profile_pic_url}
                                alt={comment.user.name}
                            />
                            ) : (
                            <Avatar />
                            )}
                        </div>
                        <p className="font-bold">{comment.user.name}</p>

                        
                    </div>

                  <div className='flex justify-between'>

                  <p className='ms-12 text-lg'>{comment.comment}</p>
                  <p className="text-gray-500 text-sm ms-10">{new Date(comment.created_at).toLocaleString()}</p>
                  </div>
                  
                </li>
              ))}
            </div>
            
        )}
      </ul>
      <form onSubmit={handleCommentSubmit} className="mt-4">
        
        <div className="flex w-full  h-20 rounded-lg bg-[#17192F] opacity-90 items-center px-4">
            <FaUser className="text-white w-6 h-7" />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Make a private comment.."
              className="ml-4 w-full h-10 px-4 py-2 bg-[#434345] border border-[#17192F] rounded-full shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400"
            />
            
          </div>
          <button
                            type='submit'
                            className=" w-20 mt-4 bg-[#3372c5] text-white text-lg font-semibold py-2 rounded-lg hover:bg-yellow-700 transition"
                        >
                           Post
                        </button>
      </form>

    </div>
  );
};

export default PrivateCommentSection;
