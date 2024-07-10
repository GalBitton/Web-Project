const updateGraphSummary = (average, type) => {
    let summaryText = '';

    switch (type) {
        case 'heartRate':
            summaryText = `Your average heartbeat per minute is ${average} BPM, which is ${average < 60 ? 'low' : average > 100 ? 'high' : 'normal'}.`;
            document.getElementById('avgHeartRateSummary').textContent = summaryText;
            break;
        case 'steps':
            summaryText = `Your average steps count is ${average}, which is ${average < 5000 ? 'low' : average > 10000 ? 'high' : 'normal'}.`;
            document.getElementById('avgStepsSummary').textContent = summaryText;
            break;
        case 'calories':
            summaryText = `Your average calories burned is ${average} kcal.`;
            document.getElementById('avgCaloriesSummary').textContent = summaryText;
            break;
        case 'sleep':
            summaryText = `Your average sleep duration is ${average} hours, which is ${average < 7 ? 'less than recommended' : 'within recommended range'}.`;
            document.getElementById('avgSleepSummary').textContent = summaryText;
            break;
        default:
            break;
    }
};

export {
    updateGraphSummary
};
