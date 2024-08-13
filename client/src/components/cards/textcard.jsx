import React from "react";

/**
 * TextCard component displays a card with a title and text content.
 *
 * @component
 * @param {Object} props - The properties for the TextCard.
 * @param {string} props.text - The text content to display in the card.
 * @param {number} props.index - The index or title to display at the top of the card.
 * @returns {JSX.Element} The rendered TextCard component.
 */
const TextCard = ({ text, index }) => {
    return (
        
        <div className="bg-white dark:bg-slate-900 bg-opacity-75 rounded-lg p-6 text-center w-full md:w-1/4 min-w-[200px] hover:scale-105 transform transition duration-300">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{index}</h2>
            <p className="text-sm md:text-base">
                {text}
            </p>
        </div>
    );
}

export default TextCard;
