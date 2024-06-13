import React, { useEffect, useState } from 'react';
import classApi from '@/api/classroomApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilePreviewModal from '@/components/User/FilePreviewModal';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '@/utils/constants';
import { MdAssignment, MdClose } from "react-icons/md";
import useAuthStore from '@/store/authStore';

function StudentAssignmentDetails() {
    const { classId, assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    const current_user = localStorage.getItem('User')
    


    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [totalPoints, setTotalPoints] = useState('');
    const [files, setFiles] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [assignedStudents,setassignedStudents]=useState([])
    const [studentFiles, setStudentFiles] = useState([]);
    const [submission, setSubmission] = useState(null);
    const [submissionFiles,setSubmissionFiles]=useState([])
    

    const [points,setPoints]=useState(null)


    

    const fetchStudentSubmission = async (studentId) => {
        try {
          const submission = await classApi.getStudentSubmission(classId, assignmentId, studentId);
          setSubmission(submission);
          setPoints(submission.points)
          setSubmissionFiles(submission.files || []);
        } catch (error) {
          console.error('Error fetching student submission:', error);
        }
      };



    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const data = await classApi.fetchStudentsdetails(classId, assignmentId);
                setAssignment(data);
                setTitle(data.title);
                setassignedStudents(data.assigned_students)
                const formattedDueDate = new Date(data.due_date).toISOString().split('T')[0];
                setDueDate(formattedDueDate);
                setTotalPoints(data.points);
                setFiles(data.files || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching assignment details:', error);
                setLoading(false);
            }
        };

        fetchAssignmentDetails();
        fetchStudentSubmission();
    }, [classId, assignmentId]);



    const handleFilePreview = (file) => {
        setSelectedFile(file);
        setIsPreviewOpen(true);
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setStudentFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleFileRemove = (index) => {
        setStudentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmitAssignment = async () => {
        const formData = new FormData();
        studentFiles.forEach((file) => {
            formData.append('files', file);
        });
        try {
            const response = await classApi.submitAssignment(classId, assignmentId, formData);
            toast.success('Assignment submitted successfully!');
            fetchStudentSubmission();
        } catch (error) {
            console.error('Error submitting assignment:', error);
            toast.error('Failed to submit assignment.');
        }
    };


    const handleUnsubmitAssignment = async () => {
        try {
            const response = await classApi.unsubmitAssignment(classId, assignmentId);
            setStudentFiles([]);
            toast.success('Assignment unsubmitted successfully!');
            fetchStudentSubmission();
        } catch (error) {
            console.error('Error unsubmitting assignment:', error);
            toast.error('Failed to unsubmit assignment.');
        }
    };

    console.log(submissionFiles)

    return (
        <>
            <div className='flex justify-between'>
                <div className='flex flex-col w-[50%] bg-[#2b2e40] p-8 rounded-lg shadow'>
                    <div>
                        <div className='flex flex-row'>
                            <MdAssignment className='text-white w-9 h-10' />
                            <p className='text-3xl ms-4'>{title}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p className=''>{assignment?.created_by.user.name}</p>
                            <p className='ms-5'>Due on: {dueDate}</p>
                            <p>Points: {totalPoints}</p>
                        </div>
                    </div>
                    <hr className='mt-4 mb-5' />

                    <div className='mb-5'>
                        <p className='text-xl'>Attachments</p>
                        <div className='mt-4'>
                            {files.map((file, index) => (
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
                    <hr className='mt-8' />

                    <div>
                        <p className='text-2xl mt-8'>Private Comments</p>
                    </div>
                </div>

                <div className='border-bg-[#282940] shadow-lg rounded w-[30%] h-full me-10 p-6 bg-[#282940]'>
                    <div className='flex justify-between'>
                        <p className='text-xl font-medium'>Your work</p>
                        <div>
                            <label
                                htmlFor="file-upload"
                                className="w-20 bg-[#4285F4] text-white text-lg font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-green-700 transition"
                            >
                                Attach
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                className='hidden'
                                onChange={handleFileChange}
                                multiple
                            />
                        </div>
                    </div>
                    <div className='mt-4'>
                        {studentFiles.map((file, index) => (
                            <div key={index} className='flex justify-between items-center bg-[#273445] p-2 rounded mt-2'>
                                <p className='text-white'>{file.name}</p>
                                <MdClose className='text-white cursor-pointer' onClick={() => handleFileRemove(index)} />
                            </div>
                        ))}
                    </div>

                    {submissionFiles && (
                        <div className='mt-10'>
                            {submissionFiles.length >0&&(
                                <p>Submitted Files:</p>
                            )}
                        {submissionFiles.map((file, index) => (
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
                    )}
                    
                    {submission && submission.status === 'submitted' ? (
                        <button
                            onClick={handleUnsubmitAssignment}
                            className="w-full mt-4 bg-[#FBBC05] text-white text-lg font-semibold py-2 rounded-lg hover:bg-yellow-700 transition"
                        >
                            Unsubmit
                        </button>
                    ):(
                        <button
                        onClick={handleSubmitAssignment}
                        className="w-full mt-4 bg-[#34A853] text-white text-lg font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Turn in
                    </button>
                    )}

                <p className='text-2xl mt-10'>Points Awarded: {points}</p>
                </div>
            </div>

            <FilePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                file={selectedFile}
            />

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

export default StudentAssignmentDetails;
