import React from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';

const useLocation = () => {
    const location = useRouterLocation();
    const inDashboard = React.useMemo(() => location.pathname === '/dashboard', [location.pathname]);

    return { location, inDashboard };
};

export default useLocation;
