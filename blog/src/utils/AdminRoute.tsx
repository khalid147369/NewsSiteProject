import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';
const AdminRoute = () => {
    const { user } = useUser();
    if (!user?.isAdmin) {
        return <Navigate to="/" replace />; // Redirect to home if not admin
    }
    return (
       <Outlet  />
    );
}

export default AdminRoute;
