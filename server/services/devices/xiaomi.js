import Device from "./device.js";

/**
 * @class XiaomiWatch
 * @extends Device
 * @description Represents a Xiaomi Watch device, extending the base Device class to handle specific data fields.
 */
class XiaomiWatch extends Device {
    constructor(config, logger, id, name, lastSeeded) {
        super(config, logger, id, name, lastSeeded);
        this.useTranslatedQualityIndex = true;
    }

    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry, handling fields like sleep, stress, and VO2Max.
     */
    getFieldValue(entry, field) {
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].duration,
                    "quality": entry[field].quality
                }
            case 'stress':
                return entry.stressLevel;
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
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].totalDuration,
                    "quality": super.convertSleepIndex(entry[field].qualityIndex)
                }
            case 'stress':
                return entry.relaxationScore / 10.0;
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
