import { GoogleOAuthProvider } from '@react-oauth/google';
import { Outlet } from 'react-router-dom';
import { Footer, AppMenu } from "../components/layouts/index.jsx";
import { AppProvider } from "@/hooks/AppProvider";
import AuthProvider from "../contexts/AuthContext.jsx";
import { Maintenance } from "./pages-components/index.jsx";

/**
 * App component that sets up the main structure of the application.
 * 
 * It provides Google OAuth context, authentication context, and application context. 
 * Displays a maintenance page if the application is in maintenance mode; otherwise, 
 * it renders the application menu, main content area, and footer.
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
    const isMaintenance = import.meta.env.VITE_MAINTENANCE === 'true';
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProvider>
                <AppProvider>
                    {isMaintenance ? <Maintenance /> :
                        <>
                            <AppMenu />
                            <main className="flex-grow flex flex-col my-4 w-full">
                                <Outlet />
                            </main>
                        </>
                    }
                    <Footer />
                </AppProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
