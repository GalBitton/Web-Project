import Device from "./device.js";

export default class AppleWatch extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].duration,
                    "quality": entry[field].quality
                }
            case 'bloodPressure':
                return {
                    systolic: entry[field].systolic,
                    diastolic: entry[field].diastolic
                }
            case 'activityRings':
            case 'heartRate':
            case 'steps':
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
                    quality: this.translateSleepQualityIndex(this._computeRandomValue("sleepQuality"))
                };
            case 'bloodPressure':
                return {
                    systolic: this._computeRandomValue("bloodPressureSystolic"),
                    diastolic: this._computeRandomValue("bloodPressureDiastolic")
                };
            case 'activityRings':
                return {
                    move: this._computeRandomValue("activityMove"),
                    exercise: this._computeRandomValue("activityExercise"),
                    stand: this._computeRandomValue("activityStand")
                };
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "activityRings", "bloodPressure"];
    }
}
