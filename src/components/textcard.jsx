import React from "react";

const TextCard = ({ text, index }) => {
    return (
        <div className="bg-gray-300 dark:bg-gray-800 bg-opacity-75 rounded-lg p-6 text-center w-full md:w-1/4 min-w-[200px] hover:scale-105 transform transition duration-300">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{index}</h2>
            <p className="text-sm md:text-base">
                {text}
            </p>
        </div>
    );
}

export default TextCard;
