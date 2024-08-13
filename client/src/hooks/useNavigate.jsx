import { useState } from 'react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';

/**
 * A custom hook for navigating programmatically with optional delay.
 * 
 * Provides a `navigate` function to change routes with an optional timeout.
 * The `redirectPath` is the destination route, and `redirectTimeout` specifies
 * the delay in seconds before navigating.
 * 
 * @returns {Object} An object containing the `navigate` function.
 * @property {Function} navigate - Function to navigate to a specific route with an optional delay.
 */
const useNavigate = () => {
    const navigateRoute = useRouterNavigate();

    /**
     * Navigates to a specified route with an optional delay.
     * 
     * @param {Object} params - Parameters for navigation.
     * @param {string} [params.redirectPath=''] - The path to navigate to.
     * @param {number} [params.redirectTimeout=0] - The delay in seconds before navigation occurs.
     */
    const navigate = ({ redirectPath = '', redirectTimeout = 0}) => {
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
