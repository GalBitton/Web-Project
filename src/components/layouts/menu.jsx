import React from 'react';
import { stack as Menu } from '@katasonovyp/react-burger-menu';
import useAuth from '../../hooks/useAuth';
import ProfileMenu from './profile-menu.jsx';
import { ThemeProvider } from "../../hooks/ThemeProvider.jsx";

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
        padding: '0.8em'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
}

const AppMenu = () => {
    const { isLoggedIn, login } = useAuth();
    const currentPath = window.location.pathname;
    const inDashboard = currentPath === '/dashboard';

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', visible: isLoggedIn },
        { name: 'Sign In', href: '#', onClick: login, visible: !isLoggedIn },
        { name: 'Sign Up', href: '#', visible: !isLoggedIn },
        { name: 'About Us', href: '#', visible: !inDashboard },
        { name: 'Contact', href: '#', visible: !inDashboard },
    ];

    const logoImage = () => {
        return (
            <a href="/" className="flex items-center hidden md:flex">
                <img src="/assets/dashboard-logo.jpg" alt="Logo" className="h-14 w-18 mr-6" />
            </a>
        );
    }

    return (
        <header className={`bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-4 flex items-center gap-40 ${inDashboard ? 'md:justify-between' : 'md:justify-center'}`}>
            <div className="md:hidden">
                <Menu styles={ menuStyles }>
                    {logoImage()}
                    {menuItems.map((item, index) =>
                        item.visible ? (
                            <a key={index} href={item.href} onClick={item.onClick} className="block px-4 py-2 text-lg hover:text-[#0059ff]">{item.name}</a>
                        ) : null
                    )}
                </Menu>
            </div>
            <nav className="hidden md:flex space-x-4 items-center gap-2">
                {logoImage()}
                {menuItems.map((item, index) =>
                    item.visible ? (
                        <a key={index} href={item.href} onClick={item.onClick} className="text-lg hover:text-[#0059ff]">{item.name}</a>
                    ) : null
                )}
            </nav>
            <ThemeProvider></ThemeProvider>
            {inDashboard && isLoggedIn && <ProfileMenu />}
        </header>
    );
};

export default AppMenu;
