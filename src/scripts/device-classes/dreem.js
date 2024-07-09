import Device from "./device.js";

export default class DreemHeadband extends Device {
    getFieldValue(entry, field) {
        if (field === 'sleep') {
            return {
                "duration": entry.sleepData.totalDuration,
                "quality": super.translateQualityIndex(entry.sleepData.sleepQuality)
            }
        } else if (field === 'EEG') {
            return {
                "alpha": entry[field].alpha,
                "beta": entry[field].beta,
                "gamma": entry[field].gamma,
                "delta": entry[field].delta,
                "theta": entry[field].theta
            }
        }
        return 0;
    }
}