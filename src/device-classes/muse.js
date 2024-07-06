import Device from "./device.js";

export default class MuseHeadband extends Device {
    getFieldValue(entry, field) {
        if (field === 'sleep') {
            return {
                "duration": entry[field].duration,
                "quality": entry[field].quality
            }
        } else if (field === 'EEG') {
            return {
                "alpha": entry[field].alphaWaves,
                "beta": entry[field].betaWaves,
                "gamma": entry[field].gammaWaves,
                "delta": entry[field].deltaWaves,
                "theta": entry[field].thetaWaves
            }
        }
        return 0;
    }
}