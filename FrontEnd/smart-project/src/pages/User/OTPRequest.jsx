import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from '@/store/authStore';
import authApi from '@/api/authApi'; // Ensure the correct import for your API

const OTPRequest = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setCurrentOtpUser);
 
  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center"
    });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const resp = await authApi.otprequest(values);
        setUser(values.email);
        navigate('/otp-verify');
      } catch (error) {
        console.error('OTP request failed:', error);
        if (error.response && error.response.data && error.response.data.detail) {
          notifyError(error.response.data.detail);
        } else {
          notifyError('OTP request failed. Please try again.');
        }
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-600 flex justify-center items-center">
      <div className="bg-slate-900 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Request OTP</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="mt-1 block w-full px-4 py-2 border bg-slate-500 border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Request OTP
          </button>
        </form>
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
      </div>
    </div>
  );
};

export default OTPRequest;
