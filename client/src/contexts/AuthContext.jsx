import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        const googleToken = localStorage.getItem('googleToken');

        if (token || googleToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();

        const handleAuthChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    function getIdentity(identifier) {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (!identity) {
            return null;
        }

        switch (identifier) {
            case 'email':
                return identity.email;
            case 'userId':
                return identity.userId;
            default:
                return null;
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, getIdentity }}>
            {isLoggedIn === null ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
