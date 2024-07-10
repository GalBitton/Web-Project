import { useState, useEffect } from 'react';

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const status = JSON.parse(localStorage.getItem('loginStatus')) || false;
        setIsLoggedIn(status);
    }, []);

    const login = () => {
        localStorage.setItem('loginStatus', true);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.setItem('loginStatus', false);
        setIsLoggedIn(false);
    };

    return { isLoggedIn, login, logout };
};

export default useAuth;
