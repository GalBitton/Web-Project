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


