
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  console.log(isAuthenticated)


  return isAuthenticated ? <Outlet/> : <Navigate to="/login" />;
};

export default PrivateRoute;
