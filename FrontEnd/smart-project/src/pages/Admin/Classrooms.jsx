import classApi from '@/api/classroomApi';
import AdminClassCards from '@/components/Admin/AdminClassCards';
import React, { useEffect, useState } from 'react';

function Classrooms() {
    const [classrooms, setClassrooms] = useState([]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            const response = await classApi.FetchAllClasses();
            setClassrooms(response);
        };

        fetchClassrooms();
    }, []);

    return (
        <div className='flex flex-wrap'>
            {classrooms.map((classroom) => (
                <div key={classroom.id} >
                    <AdminClassCards classroom={classroom} />
                </div>
            ))}
        </div>
    );
}

export default Classrooms;
