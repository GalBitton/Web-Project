import serviceData from '../../../package.json';
import useLocation from "../../hooks/useLocation";

/**
 * Footer component for displaying the footer content of the application.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * );
 * 
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer = () => {
    const { location } = useLocation();
    return (
        <footer data-testid="footer-component" className="relative z-50 bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 text-black dark:text-white p-4 text-center flex justify-center items-center gap-2 border-t border-gray-300 dark:border-gray-700">
            <p className="text-base">© {serviceData.name} - {new Date().getFullYear()} All Rights Reserved</p> -
            <a href="/terms-of-service" className={`hover:text-[#0059ff] ${location.pathname === '/terms-of-service' ? 'text-[#0059ff]' : ''}`}>Terms of Use</a> -
            <a href="/privacy-policy" className={`hover:text-[#0059ff] ${location.pathname === '/privacy-policy' ? 'text-[#0059ff]' : ''}`}>Privacy Policy</a>
        </footer>

    );
};

export default Footer;
