import serviceData from "../../../package.json";
import TextCard from "../../components/textcard.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import styled from 'styled-components';

const IndexPage = () => {
    const { isLoggedIn } = useAuth();
    const getStarted = isLoggedIn ? "/dashboard" : "/register";
    
const BackgroundImage = styled.img`
    position: absolute;
    width: 1445px;
    height: 830px;
    top: 0;
    left: 0; /* Default position */

    @media (max-width: 1445px) {
        left: calc(50% - 400px); /* Center the image horizontally */
    }
    @media (min-height: 830px) {
        height: calc(100vh - 100px); /* Expand the height relative to the viewport height */
        left: calc(50% - 550px);
    }
        
`;
    return (
        <div className="mt-16 relative flex flex-col overflow-hidden justify-between min-h-screen bg-indigo-100 dark:bg-slate-800 dark:from-gray-800 dark:via-gray-900 dark:to-black">
            
            <BackgroundImage
                src="/assets/backgrounds/logo2.png"
                alt="Landing Page Image"
                className="opacity-60 h-auto w-auto"
            />
            
            <div className="relative z-10 flex flex-col items-start p-8 max-w-xl mt-24 ml-4 md:ml-16 bg-white dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-90 rounded-lg shadow-lg animate-fadeIn">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-black dark:text-white">
                    {serviceData.name}
                </h1>
                <p className="text-sm md:text-lg mb-8 text-black dark:text-white">
                    Transform the Way You Connect and Monitor Your Devices. Our application seamlessly integrates with your smartwatches, smart bands, and other wearable devices, allowing you to track and manage all your smart devices from a single platform.
                </p>
                <a
                    href={getStarted}
                    className="hover:outline hover:outline-fuchsia-600 dark:hover:outline-cyan-300 bg-gradient-to-r from-purple-800 via-indigo-600 to-blue-900 text-white px-6 py-3 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-300 dark:focus:ring-slate-500 animate-pulse"
                >
                    Get started
                </a>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-around p-4 bg-transparent w-full space-y-4 md:space-y-0">
            {Array.from({ length: 3 }, (_, i) => (
                <TextCard
                 key={i} index={i + 1} text={
                    i === 0 ? "Real-Time Data Synchronization, Instantly sync your health and activity data across all your devices, ensuring you always have the most up-to-date information at your fingertips."
                    : i === 1 ? "Comprehensive Device Management, Manage and configure your connected devices effortlessly. From firmware updates to customization options, take full control of your smart ecosystem."
                    : "Personalized Insights and Analytics, Receive tailored insights based on your device usage, helping you make informed decisions about your health, fitness, and lifestyle."
                }/>
            ))}
            </div>
        </div>
    );
}

export default IndexPage;
