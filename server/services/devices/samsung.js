import Device from "./device.js";

class SamsungWatch extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].duration,
                    "quality": entry[field].quality
                }
            case 'stress':
                return {
                    "score": entry.stressLevel,
                }
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
            case 'oxygenSaturation':
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
            case 'stressLevel':
                return Math.random() * (ranges.stressScore.max - ranges.stressScore.min) + ranges.stressScore.min;
            case 'oxygenSaturation':
                return Math.random() * (ranges.oxygenSaturation.max - ranges.oxygenSaturation.min) + ranges.oxygenSaturation.min;
            default:
                return super.generateDataForField(field, index);
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "stressLevel", "oxygenSaturation"];
    }
}

class SamsungBracelet extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].durationHours,
                    "quality": super.translateQualityIndex(entry[field].qualityRating)
                }
            case 'stress':
                return {
                    "score": entry.stressLevel,
                }
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
            case 'breathingRate':
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
                    durationHours: Math.random() * (ranges.sleepDuration.max - ranges.sleepDuration.min) + ranges.sleepDuration.min,
                    qualityRating: Math.random()
                };
            case 'stressLevel':
                return Math.random() * (ranges.stressScore.max - ranges.stressScore.min) + ranges.stressScore.min;
            default:
                return super.generateDataForField(field, index);
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "stress", "breathingRate"];
    }
}

export {
    SamsungWatch,
    SamsungBracelet
}
