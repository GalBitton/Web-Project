import React from 'react';
import serviceData from '../../../package.json';

const Footer = () => {
    const currentPath = window.location.pathname;

    return (
        <footer className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex justify-center items-center gap-2">
            <p className="text-base">© {serviceData.name} - {new Date().getFullYear()} All Rights Reserved</p> -
            <a href="/terms-of-service" className={`hover:text-[#0059ff] ${currentPath === '/terms-of-service' ? 'text-[#0059ff]' : ''}`}>Terms of Use</a> -
            <a href="/privacy-policy" className={`hover:text-[#0059ff] ${currentPath === '/privacy-policy' ? 'text-[#0059ff]' : ''}`}>Privacy Policy</a>
        </footer>
    );
};

export default Footer;
