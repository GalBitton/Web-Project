/**
 * Generates a summary message based on the average value and type of data.
 *
 * @param {number} average - The average value of the data to be summarized.
 * @param {'heartRate' | 'steps' | 'calories' | 'sleep'} type - The type of data being summarized. Can be one of 'heartRate', 'steps', 'calories', or 'sleep'.
 * @returns {string} A string summarizing the average value and its context based on the type provided.
 */
const getGraphSummary = (average, type) => {
    switch (type) {
        case 'heartRate':
            return `Your average heartbeat per minute is ${average} BPM, which is ${average < 60 ? 'low' : average > 100 ? 'high' : 'normal'}.`;
        case 'steps':
            return `Your average steps count is ${average}, which is ${average < 5000 ? 'low' : average > 10000 ? 'high' : 'normal'}.`;
        case 'calories':
            return `Your average calories burned is ${average} kcal.`;
        case 'sleep':
            return `Your average sleep duration is ${average} hours, which is ${average < 7 ? 'less than recommended' : 'within recommended range'}.`;
        default:
            return "Unknown type";
    }
};

export {
    getGraphSummary
};


