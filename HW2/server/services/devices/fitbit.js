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
            case 'steps':
            case 'heartRate':
            case 'caloriesBurned':
                return entry[field];
            default:
                return 0;
        }
    }
}
