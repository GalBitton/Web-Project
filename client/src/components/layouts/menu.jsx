import { stack as Menu } from '@katasonovyp/react-burger-menu';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from './profile-menu.jsx';
import { UseTheme } from "@/hooks/useTheme";
import useLocation from '@/hooks/useLocation.jsx';

const menuStyles = {
    bmBurgerButton: {
        position: 'relative',
        width: '36px',
        height: '30px',
    },
    bmBurgerBars: {
        background: '#4f46e5'
    },
    bmBurgerBarsHover: {
        background: '#7c3aed'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#f87171'
    },
    bmMenuWrap: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '200px',
        height: '100%',
    },
    bmMenu: {
        background: '#1f2937',
        padding: '2em 1em 0',
        fontSize: '1em',
    },
    bmMorphShape: {
        fill: '#1f2937'
    },
    bmItemList: {
        color: '#e5e7eb',
        padding: '0.5em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1em',
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.5)',
        top: '0', // Ensure the overlay starts at the top of the screen
        height: '100vh', // Ensure the overlay covers the entire viewport
    }
};


/**
 * AppMenu component renders a responsive navigation menu with support for a burger menu on smaller screens.
 * It includes links for dashboard, sign-in, sign-up, about us, and contact us based on user authentication state.
 * It also displays a logo and profile menu for authenticated users.
 * 
 * @component
 * @name AppMenu
 * @returns {React.ReactElement} The rendered component.
 */
const AppMenu = () => {
    const { isLoggedIn } = useAuth();
    const { location } = useLocation();

    const menuItems = [
        { name: 'Dashboard', alias: 'dashboard', href: '/dashboard', visible: isLoggedIn },
        { name: 'Sign In', alias: 'login', href: '/login', visible: !isLoggedIn },
        { name: 'Sign Up', alias: 'register', href: '/register', visible: !isLoggedIn },
        { name: 'About Us', alias: 'about', href: '/about-us', visible: true },
        { name: 'Contact', alias: 'contact', href: '/contact-us', visible: true }
    ];

    /**
     * Renders the logo image.
     * @returns {React.ReactElement} The logo image element.
     */
    const logoImage = () => {
        return (
            <a href="/" className="flex items-center md:flex">
                <img src="/assets/dashboard-logo.jpg" alt="Logo" className="h-14 w-18 mr-6" />
            </a>
        );
    }

    return (
        <header data-testid="menu-component" className="bg-gradient-to-r from-purple-800 via-indigo-600 to-blue-900 dark:bg-gray-800 text-gray-100 dark:text-white p-4 flex items-center justify-between fixed top-0 w-full z-50 shadow-lg">
            <div className="md:hidden flex items-center">
                <Menu styles={menuStyles}>
                    {logoImage()}
                    {menuItems.map((item, index) =>
                        item.visible ? (
                            <a key={index} href={item.href} onClick={item.onClick} className={`block px-4 py-2 text-lg w-full items-center hover:text-[#0059ff] ${location.pathname.includes(item.alias) ? "text-[#0059ff]" : ''}`}>{item.name}</a>
                        ) : null
                    )}
                </Menu>
            </div>
            <nav className="hidden md:flex space-x-4 items-center gap-2">
                {logoImage()}
                {menuItems.map((item, index) =>
                    item.visible ? (
                        <a key={index} href={item.href} onClick={item.onClick} className={`text-lg hover:text-cyan-400 ${location.pathname.includes(item.alias) ? "text-cyan-400" : ''}`}>{item.name}</a>
                    ) : null
                )}
            </nav>
            <div className="flex items-center gap-4">
                <UseTheme />
                {isLoggedIn && <ProfileMenu />}
            </div>
        </header>

    );
};

export default AppMenu;
