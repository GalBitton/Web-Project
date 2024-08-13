import React from 'react';
import serviceData from "../../../package.json";
import TextCard from "../../components/cards/textcard.jsx";
import styled from 'styled-components';

const IndexPage = () => {
    const BackgroundImage = styled.img`
    position: fixed;
    top: 2; /* Anchor the image to the top of the viewport */
    left: 55%; /* Keep the horizontal position as you specified */
    height: 100vh;
    width: 100vw;
    object-fit: cover; /* Crop the image to fill the container */
    object-position: 70% top; /* Anchor the image to the top, crop from the bottom */
    transform: translate(-55%, 0); /* Adjust the transform to prevent vertical shifting */
`;


    const cardContent = [
        {
            key: 1,
            text: "Real-Time Data Synchronization, Instantly sync your health and activity data across all your devices, ensuring you always have the most up-to-date information at your fingertips."
        },
        {
            key: 2,
            text: "Comprehensive Device Management, Manage and configure your connected devices effortlessly. From firmware updates to customization options, take full control of your smart ecosystem."
        },
        {
            key: 3,
            text: "Personalized Insights and Analytics, Receive tailored insights based on your device usage, helping you make informed decisions about your health, fitness, and lifestyle."
        }
    ];

    const companies = [
        { name: "Apple", logoLight: "/assets/companies/apple-logo-light.svg", logoDark: "/assets/companies/apple-logo-dark.svg" },
        { name: "Fitbit", logo: "/assets/companies/fitbit-logo.svg" },
        { name: "Samsung", logoLight: "/assets/companies/samsung-logo-light.svg", logoDark: "/assets/companies/samsung-logo-dark.svg" },
        { name: "Xiaomi", logo: "/assets/companies/xiaomi-logo.svg" },
    ];

    return (
        <div className="mt-16 relative flex flex-col overflow-hidden justify-between min-h-screen bg-indigo-100 dark:bg-slate-800 dark:from-gray-800 dark:via-gray-900 dark:to-black">
            <BackgroundImage
                src="/assets/backgrounds/logo2.png"
                alt="Landing Page Image"
                className="opacity-80"
            />
            <div className="relative z-10 flex flex-col items-start p-8 max-w-xl mt-24 mb-10 ml-4 mr-4 md:ml-16 bg-white dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-90 rounded-lg shadow-lg animate-fadeIn">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-black dark:text-white">
                    {serviceData.name}
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-black dark:text-white">
                    Transform the Way You Connect and Monitor Your Devices. Our application seamlessly integrates with your smartwatches, smart bands, and other wearable devices, allowing you to track and manage all your smart devices from a single platform.
                </p>
                <a
                    href="/dashboard"
                    className="hover:outline hover:outline-fuchsia-600 dark:hover:outline-cyan-300 bg-gradient-to-r from-purple-800 via-indigo-600 to-blue-900 text-white px-6 py-3 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-300 dark:focus:ring-slate-500 animate-pulse"
                >
                    Get started
                </a>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-around p-4 bg-transparent w-full space-y-4 md:space-y-0">
                {cardContent.map((content) => (
                    <TextCard key={content.key} text={content.text} />
                ))}
            </div>

            <div className="relative z-10 mt-16 p-8 bg-transparent w-full flex flex-col items-center">
                <h2 className="text-3xl font-semibold mb-6 text-black dark:text-white">Trusted by Leading Companies</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {companies.map((company, index) => (
                        <img
                            key={index}
                            src={company.logo || company.logoDark}
                            alt={`${company.name} logo`}
                            className="h-12 md:h-16 transition-transform duration-300 hover:scale-105 dark:hidden"
                        />
                    ))}
                </div>
                <div className="hidden dark:flex flex-wrap justify-center gap-8">
                    {companies.map((company, index) => (
                        <img
                            key={index}
                            src={company.logoLight || company.logo}
                            alt={`${company.name} logo`}
                            className="h-12 md:h-16 transition-transform duration-300 hover:scale-105"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default IndexPage;
