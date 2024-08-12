import Device from "./device.js";

/**
 * @class DreemHeadband
 * @extends Device
 * @description Represents a Dreem Headband device, extending the base Device class to provide specific data handling.
 */
export default class DreemHeadband extends Device {
    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry, with special handling for EEG and sleep data.
     */
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
                if (entry[field] === undefined) {
                    return 0;
                }

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


    /**
     * @method generateDataForField
     * @param {string} field - The field name to generate data for.
     * @returns {Object|number} - Generated data for the field.
     * @description Generates data for a specific field, including EEG data, sleep data, and meditation score.
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
                    totalDuration: this._computeRandomValue("sleepDuration"),
                    sleepQuality: this._computeRandomValue("sleepQuality")
                };
            case 'meditationScore':
                return this._computeRandomValue("focusScore");
            default:
                return 0;
        }
    }

    /**
     * @method getFields
     * @returns {string[]} - List of field names supported by the Dreem Headband.
     * @description Returns an array of field names specific to the Dreem Headband, including EEG, sleep, and meditation score.
     */
    getFields() {
        return ["EEG", "sleep", "meditationScore"];
    }
}
