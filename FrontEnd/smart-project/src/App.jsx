
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserRouter from './routers/UserRouter';
import AdminRouter from './routers/AdminRouter';
import useAuthStore from './store/authStore';
import Loader from './components/ui/Loader';
import NotFound from './components/ui/NotFound';
import Modal from 'react-modal';

// Set the app element
Modal.setAppElement('#root');




const App = () => {


    console.log("App")



    return (

        <Router>
            <Routes>
                <Route path="" element={<Navigate to="/login" replace />} />  
                <Route path="/*" element={<UserRouter />} />
                <Route path="/admin/*" element={<AdminRouter />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
