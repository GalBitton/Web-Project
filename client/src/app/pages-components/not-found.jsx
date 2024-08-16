import { Link } from 'react-router-dom';

/**
 * NotFound component for displaying a 404 error page.
 * 
 * Renders a full-page message indicating that the requested page was not found.
 * Includes a link to redirect users back to the homepage.
 * 
 * @component
 * @example
 * return (
 *   <NotFound />
 * );
 */
const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-slate-800">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404 - Not Found</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    The page you're looking for doesn't exist.
                </p>
                <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    Go back to the homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
