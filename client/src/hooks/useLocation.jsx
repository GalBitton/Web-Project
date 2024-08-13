import React from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';

/**
 * A custom hook that provides information about the current location and
 * whether the current path is the dashboard.
 * 
 * Provides `location` from `react-router-dom` and a boolean `inDashboard`
 * indicating if the current path is the dashboard route.
 * 
 * @returns {Object} An object containing the current location and a boolean indicating if it is the dashboard.
 * @property {Object} location - The current location object from `react-router-dom`.
 * @property {boolean} inDashboard - `true` if the current path is '/dashboard', otherwise `false`.
 */
const useLocation = () => {
    const location = useRouterLocation();
    const inDashboard = React.useMemo(() => location.pathname === '/dashboard', [location.pathname]);

    return { location, inDashboard };
};

export default useLocation;
