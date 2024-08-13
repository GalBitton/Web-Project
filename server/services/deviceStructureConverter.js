/**
 * @class DeviceStructureConverter
 * @description A class to convert device structures based on provided field mappings and values.
 */
class DeviceStructureConverter {
    constructor() {
    }

    /**
     * @method transformObjectWithValues
     * @description Transforms an object based on the provided field mappings and values.
     * @param {Object} mapping - The field mapping object for the specific device.
     * @param {Object} values - The values to be transformed according to the mapping.
     * @returns {Object} - The transformed object.
     */
    transformObjectWithValues(mapping, values) {
        const transformedObject = {};

        Object.keys(mapping).forEach(key => {
            const value = mapping[key];
            if (typeof value === 'object') {
                // Transform nested objects and merge them directly into the transformedObject
                const nestedObject = this.transformObjectWithValues(value, values[key] || {});
                Object.assign(transformedObject, nestedObject);
            } else {
                const fieldName = key;
                const fieldValue = values[fieldName] !== undefined ? values[fieldName] : 0; // Fallback to 0

                this.setValueByPath(transformedObject, value.split('.'), fieldValue);
            }
        });

        return transformedObject;
    }

    /**
     * Sets a value in an object based on a given path.
     * @param {Object} obj - The object to set the value in.
     * @param {string[]} pathArray - The array of keys representing the path.
     * @param {*} value - The value to set.
     */
    setValueByPath(obj, pathArray, value) {
        let current = obj;
        pathArray.forEach((key, index) => {
            if (index === pathArray.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] || {};
                current = current[key];
            }
        });
    }

    /**
     * @method convertEntry
     * @description Transforms an object and adds a timestamp at the top level.
     * @param {Object} mapping - The field mapping object for the specific device.
     * @param {Object} values - The values to be transformed according to the mapping.
     * @returns {Object} - The transformed object with a timestamp.
     */
    convertEntry(mapping, timestamp, values) {
        const transformedObject = this.transformObjectWithValues(mapping, values);
        transformedObject.timestamp = timestamp.toISOString();
        return transformedObject;
    }
}

export default DeviceStructureConverter;
