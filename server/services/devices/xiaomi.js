import Device from "./device.js";

class XiaomiWatch extends Device {
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
            case 'VO2Max':
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
            case 'VO2Max':
                return Math.random() * (ranges.focusScore.max - ranges.focusScore.min) + ranges.focusScore.min;
            default:
                return super.generateDataForField(field, index);
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "stressLevel", "VO2Max"];
    }
}

class XiaomiBracelet extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].totalDuration,
                    "quality": super.translateQualityIndex(entry[field].qualityIndex)
                }
            case 'stress':
                return {
                    "score": entry.relaxationScore / 10.0
                }
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
            case 'respiratoryRate':
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
                    totalDuration: Math.random() * (ranges.sleepDuration.max - ranges.sleepDuration.min) + ranges.sleepDuration.min,
                    qualityIndex: Math.random()
                };
            case 'relaxationScore':
                return Math.random() * (ranges.stressScore.max - ranges.stressScore.min) + ranges.stressScore.min;
            case 'respiratoryRate':
                return Math.random() * (ranges.breathingRate.max - ranges.breathingRate.min) + ranges.breathingRate.min;
            default:
                return super.generateDataForField(field, index);
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "stress", "respiratoryRate"];
    }
}

export {
    XiaomiBracelet,
    XiaomiWatch
}
