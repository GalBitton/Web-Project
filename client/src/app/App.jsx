import React from "react";
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Outlet } from 'react-router-dom';
import { Footer, AppMenu } from "../components/layouts/index.jsx";
import { AppProvider } from "../hooks/AppProvider.jsx";
import AuthProvider from "../contexts/AuthContext.jsx";
import { Maintenance } from "./views-components/index.jsx";
import { AxiosProvider } from "../contexts/APIContext.jsx";

function App() {
    const isMaintenance = import.meta.env.VITE_MAINTENANCE === 'true';
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <AppProvider>
                <AxiosProvider>
                    <AuthProvider>
                        <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-slate-800 flex flex-col text-black dark:text-white max-w-full">
                            {isMaintenance ? <Maintenance /> : <>
                                <AppMenu />
                                <main className="flex-grow flex flex-col my-4 w-full px-4">
                                    <Outlet />
                                </main>
                            </>}
                            <Footer />
                        </div>
                    </AuthProvider>
                </AxiosProvider>
            </AppProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
