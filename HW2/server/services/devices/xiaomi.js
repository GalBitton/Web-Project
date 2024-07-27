import Device from "./device.js";

class XiaomiWatch extends Device {
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
            case 'VO2Max':
                return entry[field];
            default:
                return 0;
        }
    }
}

class XiaomiBracelet extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].totalDuration,
                    "quality": super.translateQualityIndex(entry[field].qualityIndex)
                }
            case 'stress':
                return {
                    "score": (100.0 - entry.relaxationScore) / 10.0
                }
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
            case 'respiratoryRate':
                return entry[field];
            default:
                return 0;
        }
    }
}

export {
    XiaomiBracelet,
    XiaomiWatch
}
