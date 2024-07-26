import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const navigate = useNavigate();

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
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {isLoggedIn === null ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
