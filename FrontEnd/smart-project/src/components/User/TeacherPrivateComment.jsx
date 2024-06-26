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

const TeacherPrivateComment = ({ assignmentId, Student_id,assignment }) => {
    

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const current_user = JSON.parse(localStorage.getItem('User'))
  console.log(current_user.id)



  const fetchComments = async () => {
    try {
      const data = await classApi.FetchPrivateComments(assignmentId,Student_id, assignment.created_by.id);
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        comment: newComment, 
      };
      const response = await classApi.PostPrivateComments(assignmentId,Student_id,assignment.created_by.id ,data);
      setComments((prevComments) => [...prevComments, response]);
      fetchComments();
      setNewComment('');
      toast.success('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment.');
    }
  };

  useEffect(() => {
    if (assignmentId && Student_id) {
        fetchComments();
    }
  }, [assignmentId,Student_id]);
  console.log(comments)

  return (
    <>
    {comments && (
            <div className="comment-section mt-6 max-h-96 overflow-y-auto">
            <ul className=" space-y-4">
              {comments&&(
                  <div>
                  {comments.map((comment) => (
                      <li key={comment.id} className="flex flex-col p-4   hover:bg-slate-700 border-gray-200 rounded" >
                          <div className='flex items-center'>
                              <div className='me-2'>
                              {comment.user.profile_pic_url ? (
                                  <img
                                      className="w-12 h-12 rounded-full object-cover"
                                      src={comment.user.profile_pic_url}
                                      alt={comment.user.name}
                                  />
                                  ) : (
                                  <Avatar  />
                                  )}
                              </div>
                              <p className="font-bold">{comment.user.name}</p>
                          </div>
      
                        
                        <p className='ms-12 text-lg'>{comment.comment}</p>
                        <p className="text-gray-500 text-sm ms-12">{new Date(comment.created_at).toLocaleString()}</p>
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

    )}
    </>
  );
};

export default TeacherPrivateComment;
