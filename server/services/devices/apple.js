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
}
