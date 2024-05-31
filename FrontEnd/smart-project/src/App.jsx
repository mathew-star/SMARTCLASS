
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserRouter from './routers/UserRouter';
import AdminRouter from './routers/AdminRouter';
import useAuthStore from './store/authStore';




const App = () => {


    console.log("App")



    return (
        <Router>
            <Routes>
                <Route path="/*" element={<UserRouter />} />
                <Route path="/admin/*" element={<AdminRouter />} />
                {/* Redirect to user home page if the route doesn't match */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
