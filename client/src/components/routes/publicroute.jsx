import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * A route component that renders its children if the user is not logged in,
 * otherwise redirects to a specified path.
 *
 * @component
 * @example
 * // Renders the children if the user is not logged in, otherwise redirects to '/dashboard'.
 * return <PublicRoute redirectTo="/dashboard" />;
 *
 * @param {Object} props - The component props.
 * @param {string} [props.redirectTo='/dashboard'] - The path to redirect to if the user is logged in.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const PublicRoute = ({ redirectTo = '/dashboard' }) => {
    const { isLoggedIn } = useAuth();

    return !isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default PublicRoute;
