import Device from "./device.js";

export default class DreemHeadband extends Device {
    getFieldValue(entry, field) {
        if (entry[field] === undefined) {
            return 0;
        }

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
                    "quality": super.convertSleepIndex(entry.sleepData.sleepQuality)
                }
            case 'meditationScore':
                return entry[field];
            default:
                return 0;
        }
    }

    generateDataForField(field) {
        switch (field) {
            case 'EEG':
                return {
                    alpha: this._computeRandomValue("eegAlpha"),
                    beta: this._computeRandomValue("eegBeta"),
                    gamma: this._computeRandomValue("eegGamma"),
                    delta: this._computeRandomValue("eegDelta"),
                    theta: this._computeRandomValue("eegTheta")
                };
            case 'sleepData':
                return {
                    totalDuration: this._computeRandomValue("sleepDuration"),
                    sleepQuality: this._computeRandomValue("sleepQuality")
                };
            case 'meditationScore':
                return this._computeRandomValue("focusScore");
            default:
                return 0;
        }
    }

    getFields() {
        return ["EEG", "sleepData", "meditationScore"];
    }
}
