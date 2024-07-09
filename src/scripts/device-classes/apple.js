import Device from "./device.js";

export default class AppleWatch extends Device {
    getFieldValue(entry, field) {
        if (field === 'heartRate') {
            return entry[field];
        } else if (field === 'caloriesBurned') {
            return entry[field];
        } else if (field === 'sleep') {
            return {
                "duration": entry[field].duration,
                "quality": entry[field].quality
            }
        } else if (field === 'bloodPressure') {
            return {
                systolic: entry[field].systolic,
                diastolic: entry[field].diastolic
            }
        }
        return 0;
    }
}