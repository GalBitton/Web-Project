import Device from "./device.js";

export default class MuseHeadband extends Device {
    getFieldValue(entry, field) {
        if (field === 'sleep') {
            return entry.sleep.duration;
        }
        return 0;
    }
}