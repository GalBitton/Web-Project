import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        navigate('/'); // Navigate to the root path after logout
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
