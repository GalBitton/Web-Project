import React from 'react';
import LoadingAnimation from '@/components/loading'; // Correct import path

const LoadingErrorComponent = ({ loading, error }) => {
    if (loading) return <LoadingAnimation />;
    if (error) return <p>Error: {error.message}</p>;
    return null;
};

export default LoadingErrorComponent;