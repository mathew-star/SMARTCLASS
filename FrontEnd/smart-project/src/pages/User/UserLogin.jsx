import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '@/store/authStore';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const [error , setError] = useState('')

  const handleToggle = () => {
      if (type==='password'){
         setIcon(eye);
         setType('text')
      } else {
         setIcon(eyeOff)
         setType('password')
      }
   }
   const notifyError = (message) => {
    toast.error(message, {
      position: "top-center"
    });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    
    onSubmit: async (values) => {
      try {
        await login(values);
        navigate('/h'); 
      } catch (error) {
        console.error('Login failed:', error);
        if (error.message === 'User is blocked. Please contact support for assistance.') {
          notifyError('You are blocked. Please contact support for assistance.');
        } else {
          notifyError('Invalid email or password');
        }
      }
    },
  });



  return (
    <div className='w-full h-screen px-[30%] py-28 bg-slate-600'>
      <div className="w-full max-w-sm p-6 m-auto mx-auto rounded-lg shadow-md bg-gray-800">
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-200">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="block w-full px-4 py-2 mt-2 border rounded-lg bg-gray-800 text-gray-300 border-gray-600 focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm text-gray-200">Password</label>
              <Link to="/otp-request" className="text-xs text-gray-400 hover:underline">Forget Password?</Link>
            </div>
            <input
              id="password"
              name="password"
              type={type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="block w-full px-4 py-2 mt-2 border rounded-lg bg-gray-800 text-gray-300 border-gray-600 focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
             <span class="relative flex justify-end items-end " onClick={handleToggle}>
                  <Icon class="absolute mr-5 mb-2  cursor-pointer" icon={icon} size={25}/>
              </span>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="mt-6">
            <button type="submit" className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
              Sign In
            </button>
          </div>
        </form>

        <div className="flex items-center mt-4">
          <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
          <Link to="#" className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">
            or login with Social Media
          </Link>
          <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
        </div>

        <div className="flex items-center mt-6 -mx-2">
          <button type="button" className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none">
            <svg className="w-4 h-4 mx-2 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z">
              </path>
            </svg>
            <span className="hidden mx-2 sm:inline">Sign in with Google</span>
          </button>
          <Link to="#" className="p-2 mx-2 text-sm font-medium text-gray-500 transition-colors duration-300 transform bg-gray-300 rounded-lg hover:bg-gray-200"></Link>
        </div>

        <p className="mt-8 text-xs font-light text-center text-gray-400"> Don't have an account? <Link to="/signup" className="font-medium text-gray-700 dark:text-gray-200 hover:underline">Create One</Link></p>
      </div>

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
  );
}

export default UserLogin;
