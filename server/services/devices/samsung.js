import Device from "./device.js";

/**
 * @class SamsungWatch
 * @extends Device
 * @description Represents a Samsung Watch device, extending the base Device class to handle specific data fields.
 */
class SamsungWatch extends Device {
    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry, handling fields like sleep, stress, and oxygen saturation.
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
                    "score": entry.stressLevel,
                }
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
            case 'oxygenSaturation':
                return entry[field];
            default:
                return 0;
        }
    }

    /**
     * @method generateDataForField
     * @param {string} field - The field name to generate data for.
     * @returns {Object|number} - Generated data for the field.
     * @description Generates data for a specific field, including sleep, stress, and oxygen saturation.
     */
    generateDataForField(field) {
        switch (field) {
            case 'sleep':
                return {
                    duration: this._computeRandomValue("sleepDuration"),
                    quality: this.convertSleepIndex(this._computeRandomValue("sleepQuality"))
                };
            case 'stress':
                return this._computeRandomValue("stressScore");
            case 'oxygenSaturation':
                return this._computeRandomValue("oxygenSaturation");
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
        }
    }

    /**
     * @method getFields
     * @returns {string[]} - List of field names supported by the Samsung Watch.
     * @description Returns an array of field names specific to the Samsung Watch, including sleep, stress, and oxygen saturation.
     */
    getFields() {
        return [...super.getFields(), "sleep", "stress", "oxygenSaturation"];
    }
}

/**
 * @class SamsungBracelet
 * @extends Device
 * @description Represents a Samsung Bracelet device, extending the base Device class to handle specific data fields.
 */
class SamsungBracelet extends Device {
    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry, handling fields like sleep, stress, and breathing rate.
     */
    getFieldValue(entry, field) {
        if (entry[field] === undefined) {
            return 0;
        }

        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].durationHours,
                    "quality": super.convertSleepIndex(entry[field].qualityRating)
                }
            case 'stress':
                return {
                    "score": entry.stressLevel,
                }
            case 'breathingRate':
            case 'heartRate':
            case 'caloriesBurned':
            case 'steps':
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
                    durationHours: this._computeRandomValue("sleepDuration"),
                    qualityRating: this._computeRandomValue("sleepQuality")
                };
            case 'stress':
                return this._computeRandomValue("stressScore");
            case 'breathingRate':
                return this._computeRandomValue("breathingRate");
            default:
                if (super.getFields().includes(field)) {
                    return super.generateDataForField(field);
                }
                return 0;
        }
    }

    /**
     * @method getFields
     * @returns {string[]} - List of field names supported by the Samsung Bracelet.
     * @description Returns an array of field names specific to the Samsung Bracelet, including sleep, stress, and breathing rate.
     */
    getFields() {
        return [...super.getFields(), "sleep", "stress", "breathingRate"];
    }
}

export {
    SamsungWatch,
    SamsungBracelet
}
