import Device from "./device.js";

/**
 * @class FitbitBracelet
 * @extends Device
 * @description Represents a Fitbit Bracelet device, extending the base Device class to handle specific data fields.
 */
export default class FitbitBracelet extends Device {
    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry. Handles fields such as sleep, stress, and breathing rate.
     */
    getFieldValue(entry, field) {
        if (entry[field] === undefined) {
            return 0;
        }

        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].duration,
                    "quality": entry[field].quality
                }
            case 'stress':
                return {
                    "score": 10.0 - entry.stressManagement.score,
                }
            case 'breathingRate':
                return entry.stressManagement.breathingRate;
            case 'steps':
            case 'heartRate':
            case 'caloriesBurned':
                return entry[field];
            default:
                return 0;
        }
    }

    /**
     * @method generateDataForField
     * @param {string} field - The field name to generate data for.
     * @returns {Object|number} - Generated data for the field.
     * @description Generates data for a specific field, including sleep, stress, and breathing rate.
     */
    generateDataForField(field) {
        switch (field) {
            case 'sleep':
                return {
                    duration: this._computeRandomValue("sleepDuration"),
                    quality: this._computeRandomValue("sleepQuality")
                };
            case 'stress':
                return {
                    score: this._computeRandomValue("stressScore"),
                    breathingRate: this._computeRandomValue("breathingRate")
                };
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
        }
    }

    /**
     * @method getFields
     * @returns {string[]} - List of field names supported by the Fitbit Bracelet.
     * @description Returns an array of field names specific to the Fitbit Bracelet, including sleep, stress, and breathing rate.
     */
    getFields() {
        return [...super.getFields(), "sleep", "stress", "breathingRate"];
    }
}
