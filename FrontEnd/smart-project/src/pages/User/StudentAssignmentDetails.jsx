import React, { useEffect, useState } from 'react';
import classApi from '@/api/classroomApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilePreviewModal from '@/components/User/FilePreviewModal';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '@/utils/constants';
import { MdAssignment, MdClose } from "react-icons/md";

function StudentAssignmentDetails() {
    const { classId, assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchtopicId, setfetchtopicId] = useState(null)

    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [totalPoints, setTotalPoints] = useState('');
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [files, setFiles] = useState([]);
    const [topics, setTopics] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [studentFiles, setStudentFiles] = useState([]);

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const data = await classApi.fetchStudentsdetails(classId, assignmentId);
                setAssignment(data);
                setTitle(data.title);
                setInstructions(data.instructions);
                const formattedDueDate = new Date(data.due_date).toISOString().split('T')[0];
                setDueDate(formattedDueDate);
                setTotalPoints(data.points);
                setfetchtopicId(data.topic);
                setSelectedStudents(data.assigned_students || []);
                setFiles(data.files || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching assignment details:', error);
                setLoading(false);
            }
        };

        fetchAssignmentDetails();
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
        } catch (error) {
            console.error('Error submitting assignment:', error);
            toast.error('Failed to submit assignment.');
        }
    };

    return (
        <>
            <div className='flex justify-between'>
                <div className='flex flex-col w-[50%]'>
                    <div>
                        <div className='flex flex-row'>
                            <MdAssignment className='text-white w-9 h-10' />
                            <p className='text-3xl ms-4'>{title}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p className=''>{assignment?.created_by.user.name}</p>
                            <p className='ms-5'>Due on: {dueDate}</p>
                            <p>{totalPoints}</p>
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
                    </div>
                </div>

                <div className='border rounded w-[30%] h-full me-10 p-6'>
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
                    <button
                        onClick={handleSubmitAssignment}
                        className="w-full mt-4 bg-[#34A853] text-white text-lg font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Turn in
                    </button>
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
