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

    generateDataForField(field) {
        switch (field) {
            case 'sleep':
                return {
                    duration: this._computeRandomValue("sleepDuration"),
                    quality: this.translateSleepQualityIndex(this._computeRandomValue("sleepQuality"))
                };
            case 'stressLevel':
                return this._computeRandomValue("stressScore");
            case 'VO2Max':
                return this._computeRandomValue("focusScore");
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
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
                    "quality": super.translateSleepQualityIndex(entry[field].qualityIndex)
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

    generateDataForField(field) {
        switch (field) {
            case 'sleep':
                return {
                    totalDuration: this._computeRandomValue("sleepDuration"),
                    qualityIndex: this._computeRandomValue("sleepQuality")
                };
            case 'relaxationScore':
                return this._computeRandomValue("stressScore");
            case 'respiratoryRate':
                return this._computeRandomValue("breathingRate");
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
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
