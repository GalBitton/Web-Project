import { useState } from 'react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';

const useNavigate = () => {
    const navigateRoute = useRouterNavigate();

    const navigate = ({ redirectPath = '', redirectTimeout = 0}) => {
        setTimeout(() => {
            navigateRoute(redirectPath);
        }, redirectTimeout * 1000);
    }

    return { navigate };
};

export default useNavigate;
