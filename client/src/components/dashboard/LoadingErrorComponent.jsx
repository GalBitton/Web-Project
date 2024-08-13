import React from 'react';
import LoadingAnimation from '@/components/loading'; // Correct import path

/**
 * Renders a loading animation or an error message based on the loading and error props.
 * 
 * @function
 * @name LoadingErrorComponent
 * @param {Object} props - The component props.
 * @param {boolean} props.loading - Whether the data is currently loading.
 * @param {Error} [props.error] - The error object if there was an error.
 * @returns {React.ReactElement|null} The rendered component or null.
 */
const LoadingErrorComponent = ({ loading, error }) => {
    if (loading) return <LoadingAnimation />;
    if (error) return <p>Error: {error.message}</p>;
    return null;
};

export default LoadingErrorComponent;