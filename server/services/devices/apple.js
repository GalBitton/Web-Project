import Device from "./device.js";

/**
 * @class AppleWatch
 * @extends Device
 * @description Represents an Apple Watch device extending the base `Device` class with specific data handling methods.
 */
export default class AppleWatch extends Device {
    /**
     * @method getFieldValue
     * @param {Object} entry - The data entry object containing field values.
     * @param {string} field - The field name to retrieve data for.
     * @returns {Object|number} - Returns the value of the field or an object with field-specific properties.
     * @description Retrieves the value for a specific field from the data entry. Handles fields like 'sleep' and 'bloodPressure' with specific structures.
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
     * @method generateDataForField
     * @param {string} field - The field name to generate data for.
     * @returns {Object|number} - Returns generated data for the field or a default value.
     * @description Generates random data for the specified field. Handles fields such as 'sleep', 'bloodPressure', and 'activityRings' with specific structures.
     */
    generateDataForField(field) {
        switch (field) {
            case 'sleep':
                return {
                    duration: this._computeRandomValue("sleepDuration"),
                    quality: this.convertSleepIndex(this._computeRandomValue("sleepQuality"))
                };
            case 'bloodPressure':
                return {
                    systolic: this._computeRandomValue("bloodPressureSystolic"),
                    diastolic: this._computeRandomValue("bloodPressureDiastolic")
                };
            case 'activityRings':
                return {
                    move: this._computeRandomValue("activityMove"),
                    exercise: this._computeRandomValue("activityExercise"),
                    stand: this._computeRandomValue("activityStand")
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
     * @returns {string[]} - Returns an array of field names specific to the Apple Watch, including fields from the superclass.
     * @description Returns a list of field names that the Apple Watch supports, combining its own fields with those from the `Device` class.
     */
    getFields() {
        return [...super.getFields(), "sleep", "activityRings", "bloodPressure"];
    }
}
