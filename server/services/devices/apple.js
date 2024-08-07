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

    generateDataForField(field, index) {
        const ranges = this._config.valueRanges;
        switch (field) {
            case 'sleep':
                return {
                    duration: Math.random() * (ranges.sleepDuration.max - ranges.sleepDuration.min) + ranges.sleepDuration.min,
                    quality: "Good"
                };
            case 'bloodPressure':
                return {
                    systolic: Math.random() * (ranges.bloodPressureSystolic.max - ranges.bloodPressureSystolic.min) + ranges.bloodPressureSystolic.min,
                    diastolic: Math.random() * (ranges.bloodPressureDiastolic.max - ranges.bloodPressureDiastolic.min) + ranges.bloodPressureDiastolic.min
                };
            case 'activityRings':
                return {
                    move: Math.random() * ranges.activityMove.max,
                    exercise: Math.random() * ranges.activityExercise.max,
                    stand: Math.random() * ranges.activityStand.max
                };
            default:
                return super.generateDataForField(field, index);
        }
    }

    getFields() {
        return [...super.getFields(), "sleep", "activityRings", "bloodPressure"];
    }
}
