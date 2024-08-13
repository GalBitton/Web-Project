import Device from "./device.js";

/**
 * @class MuseHeadband
 * @extends Device
 * @description Represents a Muse Headband device, extending the base Device class to handle specific data fields.
 */
export default class MuseHeadband extends Device {
    constructor(config, logger, id, name, lastSeeded) {
        super(config, logger, id, name, lastSeeded);
        this.useTranslatedQualityIndex = true;
    }

    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry. Handles fields such as EEG, sleep, and focus score.
     */
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

    /**
     * @method getFields
     * @returns {string[]} - List of field names supported by the Muse Headband.
     * @description Returns an array of field names specific to the Muse Headband, including EEG, sleep, and focus score.
     */
    getFields() {
        return ["EEG", "sleep", "focusScore"];
    }
}
