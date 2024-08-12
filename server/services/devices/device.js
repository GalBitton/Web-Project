import { translateSleepIndex } from "../../utils/sleepTranslation.js";

/**
 * @class Device
 * @description Base class for devices, providing methods for data generation and management.
 */
export default class Device {
    /**
     * @constructor
     * @param {Object} config - Configuration object for the device.
     * @param {Object} logger - Logger instance for logging.
     * @param {string} id - Unique identifier for the device.
     * @param {string} name - Name of the device.
     * @param {Date} lastSeeded - Timestamp of the last data seeding.
     */
    constructor(config, logger, id, name, lastSeeded) {
        this._config = config;
        this._logger = logger;

        this.name = name;
        this.id = id;
        this.data = [];
        this.lastSeeded = lastSeeded; // Store the timestamp of the last seeding
        this.randomCache = {}; // Cache for precomputed random values
    }

    /**
     * @method convertSleepIndex
     * @param {number} qualityIndex - Sleep quality index to convert.
     * @returns {number} - Translated sleep quality value.
     * @description Converts a sleep quality index into a more meaningful value using a utility function.
     */
    convertSleepIndex(qualityIndex) {
        return translateSleepIndex(qualityIndex);
    }

    /**
     * @method getFieldValue
     * @param {Object} entry - Data entry containing field values.
     * @param {string} field - The field name to retrieve.
     * @returns {Object|number} - Value of the specified field.
     * @throws {Error} - Throws error if the method is not implemented by subclass.
     * @description Retrieves the value for a specific field from the data entry. Subclasses must implement this method.
     */
    getFieldValue(entry, field) {if (entry[field] === undefined) {
            return 0;
        }
        throw new Error("Method 'getFieldValue()' must be implemented.");
    }

    /**
     * @method getFields
     * @returns {string[]} - List of field names supported by the device.
     * @description Returns an array of field names that the device supports.
     */
    getFields() {
        return ["heartRate", "steps", "caloriesBurned"];
    }

    /**
     * @method _computeRandomValue
     * @param {string} field - The field name for which to compute a random value.
     * @returns {number} - Computed random value for the field.
     * @description Computes a random value within a specified range for a given field.
     */
    _computeRandomValue(field) {
        const ranges = this._config.valueRanges;
        return Math.random() * (ranges[field].max - ranges[field].min) + ranges[field].min;
    }

    /**
     * @method generateDataForField
     * @param {string} field - The field name to generate data for.
     * @returns {Object|number} - Generated data for the field.
     * @description Generates data for a specific field. Subclasses must implement this method.
     */
    generateDataForField(field) {
        return this._computeRandomValue(field);
    }

    /**
     * @method precomputeRandomValues
     * @param {string[]} fields - List of fields to precompute random values for.
     * @param {number} count - Number of values to precompute.
     * @description Precomputes random values for specified fields and caches them for efficiency.
     */
    precomputeRandomValues(fields, count) {
        const deviations = this._config.commonFieldValueMaxDeviations;

        for (const field of fields) {
            if (field === 'sleep') {
                continue; // Skip precomputing sleep data as it's generated differently in generateDataBatch.
            }

            if (!this.randomCache[field]) {
                this.randomCache[field] = [];
            }

            for (let i = 0; i < count; i++) {
                let baseValue = this.generateDataForField(field);
                if (deviations[field] !== undefined) {
                    baseValue += Math.random() * (deviations[field] + 1) - (deviations[field] / 2);
                }
                this.randomCache[field].push(baseValue);
            }
        }
    }

    /**
     * @method getPrecomputedDataForField
     * @param {string} field - The field name to retrieve precomputed data for.
     * @param {number} index - Index of the precomputed value to retrieve.
     * @returns {number} - Precomputed data for the specified field and index.
     * @description Retrieves a precomputed random value from the cache for a given field and index.
     */
    getPrecomputedDataForField(field, index) {
        return this.randomCache[field][index];
    }

    /**
     * @method generateDataBatch
     * @param {number} batchStart - Starting index of the batch.
     * @param {number} batchEnd - Ending index of the batch.
     * @param {number} intervalMinutes - Interval in minutes between data points.
     * @param {string[]} fields - List of fields to generate data for.
     * @returns {Promise<Object[]>} - Promise resolving to an array of data entries for the batch.
     * @description Generates a batch of data entries for specified fields over a time range.
     */
    async generateDataBatch(batchStart, batchEnd, intervalMinutes, fields) {
        const ranges = this._config.valueRanges;
        const now = new Date();
        const data = [];
        const batchPromises = [];

        this.precomputeRandomValues(fields, batchEnd - batchStart);

        let sleepDataGenerated = false;

        for (let i = batchStart; i < batchEnd; i++) {
            const entry = {};
            const timestamp = new Date(now.getTime() - (i + 1) * intervalMinutes * 60 * 1000);
            const hour = timestamp.getHours();
            const day = timestamp.getDay();

            const isNightTime = (hour >= 22 || hour < 9);
            const isAfternoonNap = (day === 5 && hour >= 12 && hour < 15);

            const filteredFields = fields.filter(field => {
                if (isNightTime || isAfternoonNap) {
                    if (field === 'sleep') {
                        if (!sleepDataGenerated) {
                            sleepDataGenerated = true;
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return ['heartRate', 'EEG', 'oxygenSaturation', 'bloodPressure', 'breathingRate'].includes(field);
                } else {
                    return field !== 'sleep';
                }
            });

            const fieldPromises = filteredFields.map(field =>
                new Promise(resolve => {
                    if (field === 'sleep') {
                        let maxDuration;
                        if (hour >= 22) {
                            maxDuration = 9 + (24 - hour);
                        } else if (hour < 9) {
                            maxDuration = 9 - hour;
                        } else if (isAfternoonNap) {
                            maxDuration = 3;
                        } else {
                            maxDuration = 0;
                        }

                        const duration = Math.random() * Math.min(maxDuration, ranges.sleepDuration.max - ranges.sleepDuration.min) + ranges.sleepDuration.min;
                        entry[field] = {
                            duration: parseFloat(duration.toFixed(2)),
                            quality: this._computeRandomValue('sleepQuality')
                        };
                    } else {
                        entry[field] = this.getPrecomputedDataForField(field, i);
                    }
                    resolve();
                })
            );

            batchPromises.push(Promise.all(fieldPromises).then(() => {
                entry["timestamp"] = timestamp.toISOString();
                data.push(entry);
            }));
        }

        await Promise.all(batchPromises);
        return data;
    }

    /**
     * @method seedDatabase
     * @returns {Promise<Object[]>} - Promise resolving to an array of data batches.
     * @description Seeds the database with generated data based on configuration and elapsed time.
     */
    async seedDatabase() {
        const batchSize = this._config.batchSize || 50;
        const now = new Date();
        const intervalMinutes = parseInt(this._config.timeWindowMinutes) / parseInt(this._config.points);

        // Calculate the number of points to generate based on time elapsed since lastSeeded
        const defaultLastSeededDaysAgo = new Date(now.getTime() - parseInt(this._config.defaultLastSeeded) * 24 * 60 * 60 * 1000);
        const lastSeededTime = this.lastSeeded && this.lastSeeded > defaultLastSeededDaysAgo
            ? this.lastSeeded
            : defaultLastSeededDaysAgo;

        const timeElapsed = Math.floor((now - lastSeededTime) / (60 * 1000));
        const points = Math.floor(timeElapsed / intervalMinutes);
        const fields = this.getFields();

        // Generate data batches in parallel
        const batchPromises = [];
        for (let i = 0; i < points; i += batchSize) {
            const batchEnd = Math.min(batchSize + i, points);
            batchPromises.push(this.generateDataBatch(i, batchEnd, intervalMinutes, fields));
        }

        const dataBatches = await Promise.all(batchPromises);

        this.lastSeeded = now; // Update the last seeded timestamp
        return dataBatches; // Return data in batches
    }

    /**
     * @method extractGraphData
     * @param {Object[]} datapoints - Array of data entries to process.
     * @returns {Object} - Processed data for graphing, including labels and values.
     * @description Extracts and processes data for graphing, returning labels and values for each field.
     */
    extractGraphData(datapoints) {
        const fields = ["heartRate", "steps", "caloriesBurned", "sleep", "bloodPressure", "activityRings", "stress", "oxygenSaturation", "EEG"];
        const processedData = {};

        for (const field of fields) {
            const dps = datapoints.map(entry => {
                return {
                    timestamp: entry.timestamp,
                    data: this.getFieldValue(entry.data, field)
                }
            });

            if (dps.every(value => value.data === 0)) {
                processedData[field] = {labels: [], values: []};
                continue;
            }

            const labels = dps.map(value => {
                const date = new Date(value.timestamp);
                return `${date.toLocaleTimeString('en-GB')} ${date.toLocaleDateString('en-GB').replace(/\//g, '-')}`;
            });

            const values = dps.map(value => value.data);

            processedData[field] = { labels, values };
        }

        return processedData;
    }
}
