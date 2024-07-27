import React from 'react';
const UnderConstruction = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-slate-800">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <img src="assets/under-construction.png" alt="Under Construction" className="mx-auto mb-4 w-64 h-64" style={{ maxWidth: '100%', maxHeight: '100%' }}/>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Under Construction</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    This page is currently under construction. Please check back later.
                </p>
                <p className="text-gray-500 dark:text-gray-300">We appreciate your patience!</p>
            </div>
        </div>
    );
};

export default UnderConstruction;
