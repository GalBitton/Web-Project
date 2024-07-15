import Device from "./device.js";

class SamsungWatch extends Device {
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
            case 'oxygenSaturation':
                return entry[field];
            default:
                return 0;
        }
    }
}

class SamsungBracelet extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].durationHours,
                    "quality": super.translateQualityIndex(entry[field].qualityRating)
                }
            case 'stress':
                return {
                    "score": entry.stressLevel,
                }
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
            case 'breathingRate':
                return entry[field];
            default:
                return 0;
        }
    }
}

export {
    SamsungWatch,
    SamsungBracelet
}
