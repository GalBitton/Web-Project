import Device from "./device.js";

/**
 * @class MuseHeadband
 * @extends Device
 * @description Represents a Muse Headband device, extending the base Device class to handle specific data fields.
 */
export default class MuseHeadband extends Device {
    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry. Handles fields such as EEG, sleep, and focus score.
     */
    getFieldValue(entry, field) {
        if (entry[field] === undefined) {
            return 0;
        }

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

    /**
     * @method generateDataForField
     * @param {string} field - The field name to generate data for.
     * @returns {Object|number} - Generated data for the field.
     * @description Generates data for a specific field, including EEG, sleep, and focus score.
     */
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

    /**
     * @method getFields
     * @returns {string[]} - List of field names supported by the Muse Headband.
     * @description Returns an array of field names specific to the Muse Headband, including EEG, sleep, and focus score.
     */
    getFields() {
        return ["EEG", "sleep", "focusScore"];
    }
}
