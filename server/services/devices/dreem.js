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

    generateDataForField(field, index) {
        const ranges = this._config.valueRanges;
        switch (field) {
            case 'EEG':
                return {
                    alpha: Math.random() * (ranges.eegAlpha.max - ranges.eegAlpha.min) + ranges.eegAlpha.min,
                    beta: Math.random() * (ranges.eegBeta.max - ranges.eegBeta.min) + ranges.eegBeta.min,
                    gamma: Math.random() * (ranges.eegGamma.max - ranges.eegGamma.min) + ranges.eegGamma.min,
                    delta: Math.random() * (ranges.eegDelta.max - ranges.eegDelta.min) + ranges.eegDelta.min,
                    theta: Math.random() * (ranges.eegTheta.max - ranges.eegTheta.min) + ranges.eegTheta.min
                };
            case 'sleepData':
                return {
                    totalDuration: Math.random() * (ranges.sleepDuration.max - ranges.sleepDuration.min) + ranges.sleepDuration.min,
                    sleepQuality: Math.random() * (ranges.sleepQuality.max - ranges.sleepQuality.min) + ranges.sleepQuality.min
                };
            case 'meditationScore':
                return Math.random() * (ranges.focusScore.max - ranges.focusScore.min) + ranges.focusScore.min;
            default:
                return super.generateDataForField(field, index);
        }
    }

    getFields() {
        return [...super.getFields(), "EEG", "sleepData", "meditationScore"];
    }
}
