import serviceData from "../../../package.json";
import TextCard from "../../components/textcard.jsx";
import React from "react";
import { useAuth } from "@/contexts/AuthContext.jsx";

const IndexPage = () => {
    const { isLoggedIn } = useAuth();
    const getStarted = isLoggedIn ? "/dashboard" : "/register";
    return (
        <div className="relative flex flex-col justify-between min-h-screen">
            <img
                src="/assets/backgrounds/landingPage-transparent.png"
                alt="Landing Page Image"
                className="absolute left-1/4 inset-0 w-[75vw] h-full opacity-100"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            <div className="relative z-10 flex flex-col items-start p-8 max-w-xl mt-24 ml-4 md:ml-16 dark:bg-slate-900">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-black dark:text-white">
                    {serviceData.name}
                </h1>
                <p className="text-sm md:text-lg mb-8 text-black dark:text-white">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque laoreet suspendisse interdum consectetur libero id faucibus. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Blandit turpis cursus in hac habitasse platea. Accumsan sit amet nulla facilisi morbi tempus.
                </p>
                <a
                    href={getStarted}
                    className="bg-gray-300 dark:bg-slate-600 text-black dark:text-white px-6 py-3 rounded-full hover:bg-gray-300 transition duration-300"
                >
                    Get started
                </a>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-around p-4 bg-gradient-to-t from-black via-transparent to-black w-full space-y-4 md:space-y-0">
                {Array.from({ length: 3 }, (_, i) => (
                    <TextCard key={i} index={i + 1} text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque laoreet suspendisse interdum consectetur libero id faucibus. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Blandit turpis cursus in hac habitasse platea. Accumsan sit amet nulla facilisi morbi tempus."/>
                ))}
            </div>
        </div>
    );
}

export default IndexPage;
