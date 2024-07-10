import Device from "./device.js";

class XiaomiWatch extends Device {
    getFieldValue(entry, field) {
        if (field === 'sleep') {
            return {
                "duration": entry[field].duration,
                "quality": entry[field].quality
            }
        }
        return entry[field];
    }
}

class XiaomiBracelet extends Device {
    getFieldValue(entry, field) {
        if (field === 'stress') {
            return {
                "score": 100.0 - entry.relaxationScore,
                "breathingRate": entry.respiratoryRate
            }
        } else if (field === 'sleep') {
            return {
                "duration": entry[field].totalDuration,
                "quality": super.translateQualityIndex(entry[field].qualityIndex)
            }
        }
        return entry[field];
    }
}

export {
    XiaomiBracelet,
    XiaomiWatch
}