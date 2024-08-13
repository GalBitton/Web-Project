import React, { useState } from 'react';

/**
 * A generic slider component for displaying items.
 * 
 * @param {Object[]} items - The list of items to display in the slider.
 * @param {Function} renderItem - Function to render each item.
 * 
 * @returns {JSX.Element} The rendered slider component.
 */
const GenericSlider = ({ items, renderItem }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <div className="flex justify-center items-center w-full p-2">
                <button
                    onClick={handlePrev}
                    className="absolute left-0 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
                >
                    &#8592;
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-0 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
                >
                    &#8594;
                </button>
                <div className="w-full flex justify-center items-center">
                    {renderItem(items[currentIndex])}
                </div>
                
            </div>
            <div className="flex justify-center mt-4">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 mx-1 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default GenericSlider;
