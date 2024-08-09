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

    generateDataForField(field) {
        switch (field) {
            case 'sleep':
                return {
                    duration: this._computeRandomValue("sleepDuration"),
                    quality: this._computeRandomValue("sleepQuality")
                };
            case 'stressManagement':
                return {
                    score: this._computeRandomValue("stressScore"),
                    breathingRate: this._computeRandomValue("breathingRate")
                };
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "stressManagement"];
    }
}
