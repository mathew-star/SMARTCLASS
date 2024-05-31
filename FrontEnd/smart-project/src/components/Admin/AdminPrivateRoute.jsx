import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';



const AdminPrivateRoute = ({ children }) => {
  const {isAuthenticated,isAdmin}=useAuthStore();
  console.log("admin private")
  console.log(isAdmin, isAuthenticated)
    return (
      isAuthenticated && isAdmin ? <Outlet/> : <Navigate to='/admin/login'/>
    );
  };
export default AdminPrivateRoute
