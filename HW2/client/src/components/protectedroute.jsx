import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ redirectTo = '/login' }) => {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
