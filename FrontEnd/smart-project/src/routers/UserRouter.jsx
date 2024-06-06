// src/routers/UserRouter.js
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from '../components/Layout/UserLayout';
import PrivateRoute from '../components/User/PrivateRoute';
import Loader from '@/components/ui/Loader';
import OTPRequest from '@/pages/User/OTPRequest';
import VerifyOTP from '@/pages/User/VerifyOTP';
import ResetPassword from '@/pages/User/ResetPassword';
import NotFound from '@/components/ui/NotFound';
import ClassDashboard from '@/pages/User/ClassDashboard';
import ClassLayout from '@/components/Layout/ClassLayout';
import ClassStream from '@/pages/User/ClassStream';
import Classworks from '@/pages/User/Classworks';
import ClassPeople from '@/pages/User/ClassPeople';
import ClassGrade from '@/pages/User/ClassGrade';
import CreateAssignment from '@/pages/User/CreateAssignment';


const HomePage = lazy(() => import('../pages/User/Userhome'));
const UserProfile = lazy(() => import('../pages/User/UserProfile'));
const UserLogin = lazy(() => import('../pages/User/UserLogin'));
const UserSignUp = lazy(() => import('../pages/User/UserRegister'));

const UserRouter = () => {
  return (
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/otp-request" element={<OTPRequest />} />
          <Route path="/otp-verify" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          

          <Route element={<PrivateRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/h" element={<HomePage />} />
              <Route path="/profile" element={<UserProfile />} />

              <Route path='/c/:classId' element={<ClassLayout />}>
                  <Route path="stream" element={<ClassStream />} />
                  <Route path="works" element={<Classworks />} />
                  <Route path="create-assignment" element={<CreateAssignment />} />
                  <Route path="people" element={<ClassPeople />} />
                  <Route path="grade" element={<ClassGrade />} />
              </Route>
              
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
          

        </Routes>
      </Suspense>

  );
};

export default UserRouter;
