import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * Provides authentication status and identity information to the component tree.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render within the provider.
 * 
 * @returns {JSX.Element} The `AuthContext.Provider` component.
 */
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

    /**
     * Retrieves user identity information from local storage.
     * 
     * @param {string} identifier - The type of identity information to retrieve ('email', 'emailPrefix', 'userId').
     * @returns {string|null} The requested identity information or `null` if not found.
     */
    function getIdentity(identifier) {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (!identity) {
            return null;
        }

        switch (identifier) {
            case 'email':
                return identity.email;
            case 'emailPrefix':
                // eslint-disable-next-line no-case-declarations
                const emailName = identity.email.split("@")[0];
                return emailName.charAt(0).toUpperCase() + emailName.slice(1);
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

/**
 * Custom hook to access authentication context.
 * 
 * @returns {Object} The authentication context value.
 */
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
