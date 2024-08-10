const translateSleepQualityToIndex = (quality) => {
    switch (quality) {
        case "Very Poor":
            return 0.3;
        case "Poor":
            return 0.6;
        case "Fair":
            return 0.8;
        case "Good":
            return 0.9;
        case "Excellent":
            return 1.0;
        default:
            return "Unknown";
    }
}

const translateSleepIndex = (index) => {
    if (index < 0.3) return "Very Poor";
    if (index < 0.6) return "Poor";
    if (index < 0.8) return "Fair";
    if (index < 0.9) return "Good";
    if (index < 1) return "Excellent";
    return "Unknown";
}

export {
    translateSleepQualityToIndex,
    translateSleepIndex
}
