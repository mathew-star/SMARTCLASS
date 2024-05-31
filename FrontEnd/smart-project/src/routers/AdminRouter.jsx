import AdminPrivateRoute from '@/components/Admin/AdminPrivateRoute';
import Loader from '@/components/Loader';
import Users from '@/pages/Admin/Users';
import UserProfile from '@/pages/Admin/UserProfile';
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const AdminHomePage = lazy(() => import('../pages/Admin/AdminHome'));
const AdminLogin = lazy(() => import('../pages/Admin/AdminLogin'));

function AdminRouter() {
  return (
    <>
    <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />

          <Route element={<AdminPrivateRoute/>}>
            <Route path="/home" element={<AdminHomePage />} >
                <Route path="users" element={<Users />} />
                <Route path="profile" element={<UserProfile />} />
            </Route>

            
          </Route>
          

        </Routes>
      </Suspense>

      
    </>
  )
}

export default AdminRouter
