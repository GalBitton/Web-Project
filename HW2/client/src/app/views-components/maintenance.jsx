import React from 'react';
import {ThemeProvider} from "@/hooks/ThemeProvider.jsx";

const Maintenance = () => {
    return (
        <div className="maintenance-container">
            <div className="theme-container absolute top-0 right-0 p-6">
                <ThemeProvider></ThemeProvider>
            </div>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-slate-800">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Under Maintenance</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        We're currently performing scheduled maintenance. Please check back later.
                    </p>
                    <p className="text-gray-500 dark:text-gray-300">Thank you for your patience!</p>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
