const calculateOverallAverage = (averages) => {
    if (averages.length === 0) {
        return '0.00';
    }
    const validAverages = averages.filter(item => typeof item === 'number' && !isNaN(item));
    const total = validAverages.reduce((sum, value) => sum + value, 0);
    return (total / validAverages.length).toFixed(2);
};

export {
    calculateOverallAverage,
}
