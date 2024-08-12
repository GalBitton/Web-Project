import Device from "./device.js";

/**
 * @class XiaomiWatch
 * @extends Device
 * @description Represents a Xiaomi Watch device, extending the base Device class to handle specific data fields.
 */
class XiaomiWatch extends Device {
    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry, handling fields like sleep, stress, and VO2Max.
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
            case 'VO2Max':
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
     * @description Generates data for a specific field, including sleep, stress, and VO2Max.
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
            case 'VO2Max':
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
     * @returns {string[]} - List of field names supported by the Xiaomi Watch.
     * @description Returns an array of field names specific to the Xiaomi Watch, including sleep, stress, and VO2Max.
     */
    getFields() {
        return [...super.getFields(), "sleep", "stress", "VO2Max"];
    }
}

/**
 * @class XiaomiBracelet
 * @extends Device
 * @description Represents a Xiaomi Bracelet device, extending the base Device class to handle specific data fields.
 */
class XiaomiBracelet extends Device {
    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry, handling fields like sleep, stress, and respiratory rate.
     */
    getFieldValue(entry, field) {
        if (entry[field] === undefined) {
            return 0;
        }

        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].totalDuration,
                    "quality": super.convertSleepIndex(entry[field].qualityIndex)
                }
            case 'stress':
                return {
                    "score": entry.relaxationScore / 10.0
                }
            case 'respiratoryRate':
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
     * @description Generates data for a specific field, including sleep, stress, and respiratory rate.
     */
    generateDataForField(field) {
        switch (field) {
            case 'sleep':
                return {
                    totalDuration: this._computeRandomValue("sleepDuration"),
                    qualityIndex: this._computeRandomValue("sleepQuality")
                };
            case 'stress': // relaxationScore
                return this._computeRandomValue("stressScore") * 10; // relaxationScore is the inverse of stressScore
            case 'respiratoryRate':
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
     * @returns {string[]} - List of field names supported by the Xiaomi Bracelet.
     * @description Returns an array of field names specific to the Xiaomi Bracelet, including sleep, stress, and respiratory rate.
     */
    getFields() {
        return [...super.getFields(), "sleep", "stress", "respiratoryRate"];
    }
}

export {
    XiaomiBracelet,
    XiaomiWatch
}
