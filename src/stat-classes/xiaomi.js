import Device from "./device.js";

class XiaomiWatch extends Device {
    getFieldValue(entry, field) {
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
        }
        return entry[field];
    }
}

export {
    XiaomiBracelet,
    XiaomiWatch
}