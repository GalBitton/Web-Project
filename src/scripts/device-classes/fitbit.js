import Device from "./device.js";

export default class FitbitBracelet extends Device {
    getFieldValue(entry, field) {
        if (field === 'heartRate') {
            return entry.heartRate;
        } else if (field === 'caloriesBurned') {
            return entry.caloriesBurned;
        } else if (field === 'sleep') {
            return {
                "duration": entry[field].duration,
                "quality": entry[field].quality
            }
        } else if (field === 'stress') {
            return {
                "score": entry.stressManagement.score,
                "breathingRate": entry.stressManagement.breathingRate
            }
        }
        return 0;
    }
}