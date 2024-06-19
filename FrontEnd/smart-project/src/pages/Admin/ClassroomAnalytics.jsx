
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classApi from '@/api/classroomApi';
import { BarChart } from '@mui/x-charts/BarChart';
import { Container, Typography, Grid, Paper } from '@mui/material';

function ClassroomAnalytics() {
    const { classId } = useParams();
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await classApi.fetchClassroomAnalytics(classId);
                setAnalytics(data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };
        fetchAnalytics();
    }, [classId]);

    return (
        <Container maxWidth="lg">
        <Typography variant="h3" sx={{color:'white'}} gutterBottom>
            Classroom Performance Analytics
        </Typography>
        {analytics && (
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#1a2b50', color: 'white' }}>
                        <Typography variant="h6">Students Count</Typography>
                        <Typography variant="h4">{analytics.students_count}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#1a2b50', color: 'white' }}>
                        <Typography variant="h6">Assignments Count</Typography>
                        <Typography variant="h4">{analytics.assignments_count}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#1a2b50', color: 'white' }}>
                        <Typography variant="h6">Average Grade</Typography>
                        <Typography variant="h4">{analytics.average_grade.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#1a2b50', color: 'white' }}>
                        <Typography variant="h6">Completion Rate</Typography>
                        <Typography variant="h4">{analytics.completion_rate.toFixed(2)}%</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#1a2b50', color: 'white' }}>
                        <Typography variant="h6" gutterBottom>Performance Data</Typography>
                        <BarChart
                            width={600}
                            height={400}
                            
                            series={[
                                { data: [analytics.assignments_count], label: 'Assignments Count', id: 'assignmentsCount' },
                                { data: [analytics.average_grade], label: 'Average Grade', id: 'averageGrade' },
                                { data: [analytics.completion_rate], label: 'Completion Rate', id: 'completionRate' },
                            ]}
                            xAxis={[{ data: ['Assignments', 'Average Grade', 'Completion Rate'], scaleType: 'band' }]}
                        />
                    </Paper>
                </Grid>
            </Grid>
        )}
    </Container>
    );
}

export default ClassroomAnalytics;
