import React, { useEffect, useState } from 'react';
import classApi from '@/api/classroomApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import ViewStudenworksList from '@/components/User/ViewStudenworksList';

function StudentViewWorks() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);



    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'long' };
        return date.toLocaleDateString('en-US', options);
      };

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const data = await classApi.getStudentAssignments();
                
                const formattedStudentData = data.map(assignment => ({
                    ...assignment,
                    formatted_dates: { 
                      created_at: formatDate(assignment.created_at),
                      due_date: assignment.due_date ? formatDate(assignment.due_date) : '',
                    }
                  }));
                setAssignments(formattedStudentData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching assignments:', error);
                toast.error('Failed to load assignments.');
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);
    console.log(assignments)

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='flex justify-center items-center'>
            {assignments&&(
                <ViewStudenworksList assignments={assignments}/>
            )}
        </div>
    );
}

export default React.memo(StudentViewWorks);
