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
import ClassLayout from '@/components/Layout/ClassLayout';
import ClassStream from '@/pages/User/ClassStream';
import Classworks from '@/pages/User/Classworks';
import ClassPeople from '@/pages/User/ClassPeople';
import ClassGrade from '@/pages/User/ClassGrade';
import CreateAssignment from '@/pages/User/CreateAssignment';
import TeachersLayout from '@/components/Layout/TeachersLayout';
import StudentsWorks from '@/pages/User/StudentsWorks';
import EditClassroom from '@/pages/User/EditClassroom';
import StudentViewWorks from '@/pages/User/StudentViewWorks';




const HomePage = lazy(() => import('../pages/User/Userhome'));
const UserProfile = lazy(() => import('../pages/User/UserProfile'));
const UserLogin = lazy(() => import('../pages/User/UserLogin'));
const UserSignUp = lazy(() => import('../pages/User/UserRegister'));
const AssignmentDetails = lazy(()=> import('../pages/User/AssignmentDetails'));
const StudentAssignmentDetails = lazy(()=> import('@/pages/User/StudentAssignmentDetails'))
const UserNotificationPage  = lazy(()=>import('@/pages/User/UserNotification'))
const DisscussionPage= lazy(()=> import('@/pages/User/Disscuss'))

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
              <Route path='/notification' element={<UserNotificationPage/>}/>
              <Route path='/c/:classId' element={<ClassLayout />}>
                  <Route path='/c/:classId/classroom' element={<EditClassroom/>} />
                  <Route path="stream" element={<ClassStream />} />
                  <Route path="works" element={<Classworks />} />
                  <Route path="discussion" element={<DisscussionPage />} />
                  <Route path='view-student_works' element={<StudentViewWorks/>} />
                  <Route path="create-assignment" element={<CreateAssignment />} />
                  <Route path="people" element={<ClassPeople />} />
                  <Route path="grade" element={<ClassGrade />} />
                  <Route path='s/:assignmentId/assignment_details' element={<StudentAssignmentDetails />}/>
                  <Route path='t' element={<TeachersLayout/>}>
                    <Route path=':assignmentId/assignment_details' element={<AssignmentDetails/> } />
                    <Route path=':assignmentId/student_works' element={<StudentsWorks/> } />

                  </Route>
              </Route>
              
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
          

        </Routes>
      </Suspense>

  );
};

export default UserRouter;
