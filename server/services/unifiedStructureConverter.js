class UnifiedStructureConverter {
    constructor(deviceInstance) {
        this.deviceInstance = deviceInstance;
    }

    /**
     * @method translateToUnifiedStructure
     * @param {Object} entry - The data entry to be converted.
     * @returns {Object} - The unified structure of the data entry.
     * @description Converts the given entry from its original device-specific structure into the unified structure.
     */
    translateToUnifiedStructure(entry) {
        const unifiedData = {};
        const fields = this.deviceInstance.getFields();

        fields.forEach(field => {
            const fieldValue = this.deviceInstance.getFieldValue(entry, field);
            if (fieldValue !== 0) {
                unifiedData[field] = fieldValue;
            }
        });
        return unifiedData;
    }

    /**
     * @method getNestedField
     * @param {Object} entry - The unified data entry.
     * @param {string} field - The specific field to retrieve.
     * @returns {any} - The value of the nested field within the unified data entry.
     * @description Retrieves a specific nested field from the unified data entry.
     */
    getNestedField(entry, field) {
        const pathArray = field.split('.');
        return this.getValueByPath(entry, pathArray);
    }

    /**
     * @method getValueByPath
     * @param {Object} obj - The object to retrieve the value from.
     * @param {Array} pathArray - The array representing the path to the field.
     * @returns {any} - The value at the specified path.
     */
    getValueByPath(obj, pathArray) {
        let current = obj;
        for (let i = 0; i < pathArray.length; i++) {
            current = current[pathArray[i]];
            if (current === undefined) {
                return null;
            }
        }
        return current;
    }
}

export default UnifiedStructureConverter;
