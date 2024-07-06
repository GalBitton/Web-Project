import Device from "./device.js";

class SamsungWatch extends Device {
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

class SamsungBracelet extends Device {
    getFieldValue(entry, field) {
        if (field === 'sleep') {
            return {
                "duration": entry[field].durationHours,
                "quality": super.translateQualityIndex(entry[field].qualityRating)
            }
        }
        return entry[field];
    }
}

export {
    SamsungWatch,
    SamsungBracelet
}