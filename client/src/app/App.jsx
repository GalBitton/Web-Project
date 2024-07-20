import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Outlet } from 'react-router-dom';
import { Footer, AppMenu } from "../components/layouts/index.jsx";
import { AppProvider } from "../hooks/AppProvider.jsx";
import AuthProvider from "../hooks/AuthContext.jsx";
import { Maintenance } from "./views-components/index.jsx";

function App() {
    const isMaintenance = import.meta.env.VITE_MAINTENANCE === 'true';
    return (
        <GoogleOAuthProvider clientId="">
            <AppProvider>
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
            </AppProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
