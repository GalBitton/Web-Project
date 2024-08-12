import Device from "./device.js";

class SamsungWatch extends Device {
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
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
            case 'oxygenSaturation':
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
            case 'oxygenSaturation':
                return this._computeRandomValue("oxygenSaturation");
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "stress", "oxygenSaturation"];
    }
}

class SamsungBracelet extends Device {
    getFieldValue(entry, field) {
        if (entry[field] === undefined) {
            return 0;
        }

        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].durationHours,
                    "quality": super.convertSleepIndex(entry[field].qualityRating)
                }
            case 'stress':
                return {
                    "score": entry.stressLevel,
                }
            case 'breathingRate':
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
                    durationHours: this._computeRandomValue("sleepDuration"),
                    qualityRating: this._computeRandomValue("sleepQuality")
                };
            case 'stress':
                return this._computeRandomValue("stressScore");
            case 'breathingRate':
                return this._computeRandomValue("breathingRate");
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
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
