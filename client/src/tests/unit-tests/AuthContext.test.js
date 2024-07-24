import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext.jsx';

// Mock component to tests useAuth hook
const MockComponent = () => {
    const { isLoggedIn, login, logout } = useAuth();

    return (
        <div>
            <div data-testid="auth-status">{isLoggedIn ? 'Authenticated' : 'Not Authenticated'}</div>
            <button data-testid="login-button" onClick={login}>Login</button>
            <button data-testid="logout-button" onClick={logout}>Logout</button>
        </div>
    );
};

test('renders AuthContextProvider component', () => {
    const { getByTestId } = render(
        <MemoryRouter>
            <AuthProvider>
                <div data-testid="auth-context-provider" />
            </AuthProvider>
        </MemoryRouter>
    );
    expect(getByTestId('auth-context-provider')).toBeInTheDocument();
});

test('AuthContextProvider provides auth status', () => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        </MemoryRouter>
    );

    const authStatus = screen.getByTestId('auth-status');
    expect(authStatus).toHaveTextContent('Not Authenticated');
});

test('useAuth hook provides login and logout functionality', () => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <MockComponent />
            </AuthProvider>
        </MemoryRouter>
    );

    const authStatus = screen.getByTestId('auth-status');
    const loginButton = screen.getByTestId('login-button');
    const logoutButton = screen.getByTestId('logout-button');

    // Test login functionality
    act(() => {
        loginButton.click();
    });
    expect(authStatus).toHaveTextContent('Authenticated');

    // Test logout functionality
    act(() => {
        logoutButton.click();
    });
    expect(authStatus).toHaveTextContent('Not Authenticated');
});
