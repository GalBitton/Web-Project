import Device from "./device.js";

export default class FitbitBracelet extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].duration,
                    "quality": entry[field].quality
                }
            case 'stress':
                return {
                    "score": 10.0 - entry.stressManagement.score,
                }
            case 'breathingRate':
                return entry.stressManagement.breathingRate;
            case 'steps':
            case 'heartRate':
            case 'caloriesBurned':
                return entry[field];
            default:
                return 0;
        }
    }

    generateDataForField(field, index) {
        const ranges = this._config.valueRanges;
        switch (field) {
            case 'sleep':
                return {
                    duration: Math.random() * (ranges.sleepDuration.max - ranges.sleepDuration.min) + ranges.sleepDuration.min,
                    quality: "Good"
                };
            case 'stressManagement':
                return {
                    score: Math.random() * ranges.stressScore.max,
                    breathingRate: Math.random() * (ranges.breathingRate.max - ranges.breathingRate.min) + ranges.breathingRate.min
                };
            default:
                return super.generateDataForField(field, index);
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "stressManagement"];
    }
}
