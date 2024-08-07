import Device from "./device.js";

export default class MuseHeadband extends Device {
    getFieldValue(entry, field) {
        switch (field) {
            case 'EEG':
                return {
                    "alpha": entry[field].alphaWaves,
                    "beta": entry[field].betaWaves,
                    "gamma": entry[field].gammaWaves,
                    "delta": entry[field].deltaWaves,
                    "theta": entry[field].thetaWaves
                }
            case 'sleep':
                return {
                    "duration": entry[field].duration,
                    "quality": entry[field].quality
                }
            case 'focusScore':
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
                    alphaWaves: Math.random() * (ranges.eegAlpha.max - ranges.eegAlpha.min) + ranges.eegAlpha.min,
                    betaWaves: Math.random() * (ranges.eegBeta.max - ranges.eegBeta.min) + ranges.eegBeta.min,
                    gammaWaves: Math.random() * (ranges.eegGamma.max - ranges.eegGamma.min) + ranges.eegGamma.min,
                    deltaWaves: Math.random() * (ranges.eegDelta.max - ranges.eegDelta.min) + ranges.eegDelta.min,
                    thetaWaves: Math.random() * (ranges.eegTheta.max - ranges.eegTheta.min) + ranges.eegTheta.min
                };
            case 'sleep':
                return {
                    duration: Math.random() * (ranges.sleepDuration.max - ranges.sleepDuration.min) + ranges.sleepDuration.min,
                    quality: Math.random() * (ranges.sleepQuality.max - ranges.sleepQuality.min) + ranges.sleepQuality.min
                };
            case 'focusScore':
                return Math.random() * (ranges.focusScore.max - ranges.focusScore.min) + ranges.focusScore.min;
            default:
                return super.generateDataForField(field, index);
        }
    }

    getFields() {
        return [...super.getFields(), "EEG", "sleep", "focusScore"];
    }
}
