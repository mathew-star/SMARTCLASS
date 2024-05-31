import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import useAuthStore from '@/store/authStore';
import authApi from '@/api/authApi';
import { useNavigate } from 'react-router-dom';


function ResetPassword() {
    const navigate = useNavigate()
    const reset_token = useAuthStore((state)=>state.reset_token)
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);

    const handleToggle = () => {
        if (type==='password'){
           setIcon(eye);
           setType('text')
        } else {
           setIcon(eyeOff)
           setType('password')
        }
     }

    const notifySuccess = () => {
        toast.success("Password changed successfully", {
          position: "top-center"
        });
      };
    
      const formik = useFormik({
        initialValues: {
          newPassword: '',
          confirmPassword: '',
        },
        validationSchema: Yup.object({
          newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Required'),
        }),
        onSubmit: async(values) => {
            try {
                const value = {"reset_token":reset_token,"password":values.newPassword}
                await authApi.resetPassword(value);
        
              navigate('/login')
              
            } catch (error) {
              console.error('failed:', error);
              if (error.response && error.response.data && error.response.data.detail) {
                notifyError(error.response.data.detail);
              } else {
                notifyError('Please try again.');
              }
            }
            
          
        },
      });
    
      return (
        <div className="min-h-screen bg-slate-600 flex justify-center items-center">
          <div className="bg-slate-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-300">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                  className="mt-1 block w-full px-4 py-2 bg-gray-400 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span class="relative flex justify-end items-end " onClick={handleToggle}>
                  <Icon class="absolute mr-5 mb-2  cursor-pointer" icon={icon} size={25}/>
              </span>
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.newPassword}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-300">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className="mt-1 block w-full px-4 py-2 border bg-gray-400 text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span class="relative flex justify-end items-end " onClick={handleToggle}>
                  <Icon class="absolute mr-5 mb-2  cursor-pointer" icon={icon} size={25}/>
              </span>
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.confirmPassword}</div>
                ) : null}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                disabled={formik.isSubmitting}
              >
                Change Password
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
      );
}

export default ResetPassword
