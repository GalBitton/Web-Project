import { useState } from 'react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';

const useNavigate = () => {
    const navigateRoute = useRouterNavigate();

    const navigate = ({ redirectPath = '', redirectTimeout = 0}) => {
        if (!redirectPath) {
            return;
        }

        if (redirectTimeout === 0) {
            navigateRoute(redirectPath);
            return;
        }

        setTimeout(() => {
            navigateRoute(redirectPath);
        }, redirectTimeout * 1000);
    }

    return { navigate };
};

export default useNavigate;
