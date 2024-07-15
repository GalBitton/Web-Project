import Device from "./device.js";

export default class DreemHeadband extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'EEG':
                return {
                    "alpha": entry[field].alpha,
                    "beta": entry[field].beta,
                    "gamma": entry[field].gamma,
                    "delta": entry[field].delta,
                    "theta": entry[field].theta
                }
            case 'sleep':
                return {
                    "duration": entry.sleepData.totalDuration,
                    "quality": super.translateQualityIndex(entry.sleepData.sleepQuality)
                }
            case 'meditationScore':
                return entry[field];
            default:
                return 0;
        }
    }
}
