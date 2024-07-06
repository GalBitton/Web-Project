const createCSV = (labels, dataset, fileName) => {
    let csvContent = "data:text/csv;charset=utf-8,";

    const headers = ["Label"];
    if (dataset.length > 0 && typeof dataset[0] === 'object') {
        headers.push(...Object.keys(dataset[0]));
    } else {
        headers.push("Value");
    }
    csvContent += headers.join(",") + "\n";

    for (let i = 0; i < labels.length; i++) {
        const row = [labels[i]];
        if (typeof dataset[i] === 'object') {
            row.push(...Object.values(dataset[i]));
        } else {
            row.push(dataset[i]);
        }
        csvContent += row.join(",") + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

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

const calculateOverallAverage = (averages) => {
    const validAverages = averages.filter(item => typeof item === 'number' && !isNaN(item));
    const total = validAverages.reduce((sum, value) => sum + value, 0);
    return (total / validAverages.length).toFixed(2);
};

export {
    createCSV,
    updateGraphSummary,
    calculateOverallAverage
}