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
}
