import Device from "./device.js";

export default class DreemHeadband extends Device {
    getFieldValue(entry, field) {
        if (field === 'sleep') {
            return entry.sleepData.totalDuration;
        }
        return 0;
    }
}