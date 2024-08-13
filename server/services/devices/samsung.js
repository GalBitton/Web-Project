import Device from "./device.js";

/**
 * @class SamsungWatch
 * @extends Device
 * @description Represents a Samsung Watch device, extending the base Device class to handle specific data fields.
 */
class SamsungWatch extends Device {
    constructor(config, logger, id, name, lastSeeded) {
        super(config, logger, id, name, lastSeeded);
        this.useTranslatedQualityIndex = true;
    }

    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @description Retrieves the value for a specific field from the data entry, handling fields like sleep, stress, and oxygen saturation.
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
        switch (field) {
            case 'sleep':
                return {
                    "duration": entry[field].durationHours,
                    "quality": super.convertSleepIndex(entry[field].qualityRating)
                }
            case 'stress':
                return entry.stressLevel;
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
