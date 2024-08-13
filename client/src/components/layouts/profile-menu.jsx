import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from "@/services/api/APIService";

/**
 * ProfileMenu component for displaying a user profile menu with a logout option.
 * 
 * @component
 * @name ProfileMenu
 * @returns {React.ReactElement} The rendered component.
 */
function ProfileMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    /**
     * Toggles the menu open/close state.
     */
    const handleToggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    /**
     * Closes the menu if a click is detected outside of the menu or the button.
     * @param {MouseEvent} event - The mouse click event.
     */
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

    /**
     * Handles logout action, calls API to log out, and navigates to the home page.
     * @async
     */
    const handleLogoutClick = async () => {
        const apiService = new APIService( { action: 'logout' });
        const response = await apiService.execute();
        if (response && response.error) {
            console.error('Logout failed:', response.error);
            return;
        }
        setMenuOpen(false);
        navigate('/');
    };

    return (
        <div data-testid="profile-menu" className="relative flex justify-center items-center">
            <img
                ref={buttonRef}
                src="/assets/profilePicture.webp"
                alt="Profile"
                className="h-16 w-16 cursor-pointer md:mx-16"
                onClick={handleToggleMenu}
            />
            {menuOpen && (
                <div
                    ref={menuRef}
                    className="absolute mt-2 w-44 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg shadow-lg divide-y flex flex-col z-50"
                    style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
                >
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 w-full text-center" onClick={handleLogoutClick}>Logout</a>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
