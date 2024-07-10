import React from 'react';
import useAuth from '../../hooks/useAuth';

const ProfileMenu = () => {
    const { logout } = useAuth();

    const handleSettingsClick = (e) => {
        e.preventDefault();
        console.log('Settings clicked');
    };

    const handleLogoutClick = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <div className="relative">
            <img
                src="/assets/profilePicture.webp"
                alt="Profile"
                className="h-16 cursor-pointer mx-10"
                onClick={() => document.getElementById('top-menu').classList.toggle('hidden')}
            />
            <div
                id="top-menu"
                className="hidden absolute right-0 mt-2 w-36 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg shadow-lg divide-y flex flex-col"
            >
                <a href="#" className="block px-4 py-4 hover:bg-gray-300 w-full text-center" onClick={handleSettingsClick}>Settings</a>
                <a href="#" className="block px-4 py-4 hover:bg-gray-300 w-full text-center" onClick={handleLogoutClick}>Logout</a>
            </div>
        </div>
    );
};

export default ProfileMenu;
