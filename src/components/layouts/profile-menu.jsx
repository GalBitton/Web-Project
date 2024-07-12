import { useState, useRef, useEffect } from 'react';
import useAuth from '../../hooks/useAuth.jsx';

function ProfileMenu() {
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleToggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSettingsClick = () => {
        // Your settings click handler here
        console.log('Your settings click handler');
    };

    const handleLogoutClick = () => {
        // Your logout click handler here
        console.log('Your logout click handler');
    };

    return (
        <div className="relative flex justify-center items-center">
            <img
                ref={buttonRef}
                src="/assets/profilePicture.webp"
                alt="Profile"
                className="h-16 w-16 cursor-pointer mx-16"
                onClick={handleToggleMenu}
            />
            {menuOpen && (
                <div
                    ref={menuRef}
                    className="absolute mt-2 w-44 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg shadow-lg divide-y flex flex-col z-50"
                    style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
                >
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 w-full text-center" onClick={handleSettingsClick}>Settings</a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 w-full text-center" onClick={logout}>Logout</a>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
