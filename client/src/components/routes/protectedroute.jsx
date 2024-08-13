import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * A route component that renders its children if the user is logged in,
 * otherwise redirects to a specified path.
 *
 * @component
 * @example
 * // Renders the children if the user is logged in, otherwise redirects to '/login'.
 * return <ProtectedRoute redirectTo="/login" />;
 *
 * @param {Object} props - The component props.
 * @param {string} [props.redirectTo='/login'] - The path to redirect to if the user is not logged in.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const ProtectedRoute = ({ redirectTo = '/login' }) => {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
