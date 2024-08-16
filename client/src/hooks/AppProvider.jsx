import { useEffect } from "react";
import serviceData from "../../package.json";

/**
 * Provides global styles and sets the document title based on the application's name.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render within the provider.
 *
 * @returns {JSX.Element} The `AppProvider` component with global styles and title settings.
 */
export const AppProvider = ({ children }) => {
    useEffect(() => {
        const title = document.createElement("title");
        title.innerText = serviceData.name;
        document.head.appendChild(title);

        return () => {
            document.head.removeChild(title);
        };
    }, []);

    return (
        <div data-testid="app-provider" className="bg-white dark:bg-slate-900 text-white">
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-slate-800 flex flex-col text-black dark:text-white max-w-full">
            {children}
            </div>
        </div>
    );
}
