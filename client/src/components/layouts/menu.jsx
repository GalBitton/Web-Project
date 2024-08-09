import React from 'react';
import { stack as Menu } from '@katasonovyp/react-burger-menu';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from './profile-menu.jsx';
import { ThemeProvider } from "@/hooks/ThemeProvider";
import useLocation from '@/hooks/useLocation.jsx';

const menuStyles = {
    bmBurgerButton: {
        position: 'relative',
        width: '36px',
        height: '30px',
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmBurgerBarsHover: {
        background: '#a90000'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenuWrap: {
        position: 'fixed',
        top: '0',
        alignItems: 'center',
        height: '100%'
    },
    bmMenu: {
        background: '#373a47',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1em'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}

const AppMenu = () => {
    const { isLoggedIn } = useAuth();
    const { location } = useLocation();

    const menuItems = [
        { name: 'Dashboard', alias: 'dashboard', href: '/dashboard', visible: isLoggedIn },
        { name: 'Sign In', alias: 'login', href: '/login', visible: !isLoggedIn },
        { name: 'Sign Up', alias: 'register', href: '/register', visible: !isLoggedIn },
        { name: 'About Us', alias: 'about', href: '/about-us', visible: true },
        { name: 'Contact', alias: 'contact', href: '/contact-us', visible: true },
    ];

    const logoImage = () => {
        return (
            <a href="/" className="flex items-center hidden md:flex">
                <img src="/assets/dashboard-logo.jpg" alt="Logo" className="h-14 w-18 mr-6" />
            </a>
        );
    }

    return (
        <header data-testid="menu-component" className={`bg-gradient-to-r from-purple-800 via-indigo-600 to-blue-900 dark:bg-gray-800 text-gray-100 dark:text-white p-4 flex items-center gap-10 ${'md:justify-between'} fixed top-0 w-full z-50 shadow-lg`}>
            <div className="md:hidden">
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
            <div className="flex items-center">
                <ThemeProvider></ThemeProvider>
                {isLoggedIn && <ProfileMenu />}
            </div>
        </header>
    );
};

export default AppMenu;
