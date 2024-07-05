import Device from "./device.js";

export default class AppleWatch extends Device {
    getFieldValue(entry, field) {
        if (field === 'heartRate') {
            return entry.heartRate;
        } else if (field === 'caloriesBurned') {
            return entry.caloriesBurned;
        } else if (field === 'sleep') {
            return entry.sleep.duration;
        }
        return 0;
    }
}