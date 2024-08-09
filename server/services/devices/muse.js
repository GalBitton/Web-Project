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
            case 'sleep':
                return {
                    duration: this._computeRandomValue("sleepDuration"),
                    quality: this._computeRandomValue("sleepQuality")
                };
            case 'focusScore':
                return this._computeRandomValue("focusScore");
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
        }
    }

    getFields() {
        return [...super.getFields(), "EEG", "sleep", "focusScore"];
    }
}
