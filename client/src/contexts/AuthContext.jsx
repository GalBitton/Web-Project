import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const googleToken = localStorage.getItem('token');
        const token = localStorage.getItem('googleToken');
        let status = false;
        if (googleToken || token) {
            status = true;
        }
        setIsLoggedIn(status);
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
