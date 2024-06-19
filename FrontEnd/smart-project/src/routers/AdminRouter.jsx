import AdminPrivateRoute from '@/components/Admin/AdminPrivateRoute';
import Loader from '@/components/ui/Loader';
import Users from '@/pages/Admin/Users';
import UserProfile from '@/pages/Admin/UserProfile';
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from '@/components/ui/NotFound';
import AdminClassroomLayout from '@/components/Layout/AdminClassroomLayout';
import Classrooms from '@/pages/Admin/Classrooms';
import AdminClassCards from '@/components/Admin/AdminClassCards';
import AdminClassMembers from '@/pages/Admin/AdminClassMembers';
import AdminDashboard from '@/pages/Admin/AdminDashboard';

const AdminHomePage = lazy(() => import('../pages/Admin/AdminHome'));
const AdminLogin = lazy(() => import('../pages/Admin/AdminLogin'));
const ClassroomAnalyticsPage= lazy(()=> import('@/pages/Admin/ClassroomAnalytics'))

function AdminRouter() {
  return (
    <>
    <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
  
          <Route element={<AdminPrivateRoute/>}>
            <Route path="/h" element={<AdminHomePage />} >
                <Route path='dashboard' element={<AdminDashboard/>} />
                <Route path="users" element={<Users />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path='classrooms' element={<Classrooms/>} />
                <Route path='c/:classId' element={<AdminClassroomLayout/>}>
                    <Route path='members' element={<AdminClassMembers/> } />
                    <Route path='analytics' element={<ClassroomAnalyticsPage />} />
                </Route>
            </Route>

            
          </Route>

          <Route path="*" element={<NotFound />} />
          

        </Routes>
      </Suspense>

      
    </>
  )
}

export default AdminRouter
