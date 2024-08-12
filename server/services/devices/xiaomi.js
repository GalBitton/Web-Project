import Device from "./device.js";

class XiaomiWatch extends Device {
    getFieldValue(entry, field) {
        if (entry[field] === undefined) {
            return 0;
        }
        
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
            case 'VO2Max':
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
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
                    quality: this.convertSleepIndex(this._computeRandomValue("sleepQuality"))
                };
            case 'stress':
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
        return [...super.getFields(), "sleep", "stress", "VO2Max"];
    }
}

class XiaomiBracelet extends Device {
    getFieldValue(entry, field) {
        if (entry[field] === undefined) {
            return 0;
        }

        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].totalDuration,
                    "quality": super.convertSleepIndex(entry[field].qualityIndex)
                }
            case 'stress':
                return {
                    "score": entry.relaxationScore / 10.0
                }
            case 'respiratoryRate':
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
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
            case 'stress': // relaxationScore
                return this._computeRandomValue("stressScore") * 10; // relaxationScore is the inverse of stressScore
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
