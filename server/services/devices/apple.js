import Device from "./device.js";

/**
 * @class AppleWatch
 * @extends Device
 * @description Represents an Apple Watch device extending the base `Device` class with specific data handling methods.
 */
export default class AppleWatch extends Device {
    constructor(config, logger, id, name, lastSeeded) {
        super(config, logger, id, name, lastSeeded);
        this.useTranslatedQualityIndex = true;
    }

    /**
     * @method getFieldValue
     * @param {Object} entry - The data entry object containing field values.
     * @param {string} field - The field name to retrieve data for.
     * @returns {Object|number} - Returns the value of the field or an object with field-specific properties.
     * @description Retrieves the value for a specific field from the data entry. Handles fields like 'sleep' and 'bloodPressure' with specific structures.
     */
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].duration,
                    "quality": entry[field].quality
                }
            case 'bloodPressure':
                return {
                    systolic: entry[field].systolic,
                    diastolic: entry[field].diastolic
                }
            case 'activityRings':
            case 'heartRate':
            case 'steps':
            case 'caloriesBurned':
                return entry[field];
            default:
                return 0;
        }
    }

    /**
     * @method getFields
     * @returns {string[]} - Returns an array of field names specific to the Apple Watch, including fields from the superclass.
     * @description Returns a list of field names that the Apple Watch supports, combining its own fields with those from the `Device` class.
     */
    getFields() {
        return [...super.getFields(), "sleep", "activityRings", "bloodPressure"];
    }
}
