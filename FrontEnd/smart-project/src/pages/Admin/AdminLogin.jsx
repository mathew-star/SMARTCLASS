import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuthStore from '@/store/authStore';

function AdminLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(<FaEyeSlash />);
  const [error, setError] = useState('');

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(<FaEye />);
      setType('text');
    } else {
      setIcon(<FaEyeSlash />);
      setType('password');
    }
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
        navigate('/admin/h');
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
  });

  return (
    <div className='w-full h-screen px-[30%] py-28 bg-slate-600'>
      <div className="w-full max-w-sm p-6 m-auto mx-auto rounded-lg shadow-md bg-gray-800">
        <h1 className='text-white text-center text-2xl'>ADMIN</h1>
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
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="block w-full px-4 py-2 mt-2 border rounded-lg bg-gray-800 text-gray-300 border-gray-600 focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <span className="absolute right-3 top-3 cursor-pointer" onClick={handleToggle}>
                <IconContext.Provider value={{ size: '1.5em', color: 'gray' }}>
                  {icon}
                </IconContext.Provider>
              </span>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="mt-6">
            <button type="submit" className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
