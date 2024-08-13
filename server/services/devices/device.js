import UnifiedStructureConverter from "../unifiedStructureConverter.js";
import { translateSleepIndex } from "../../utils/sleepTranslation.js";
import { fieldMappings } from "../../enums/mappings.js";
import DeviceStructureConverter from "../deviceStructureConverter.js";

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
        this.useTranslatedQualityIndex = false; // Whether to use a translated sleep quality index
        this.randomCache = {}; // Cache for precomputed random values
        this.converter = new DeviceStructureConverter();
    }

    /**
     * @method convertSleepIndex
     * @param {number} qualityIndex - Sleep quality index to convert.
     * @returns {string} - Translated sleep quality value.
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
     * @method computeValueForField
     * @description Computes the value for a field based on the previous entry, deviation, and configured ranges.
     * @param {string} field - The field name to compute the value for.
     * @param {number} lastValue - The last generated value for the field.
     * @param {boolean} accumulate - Whether the value should accumulate over time.
     * @returns {number} - The computed value.
     */
    computeValueForField(field, lastValue = null, accumulate = false) {
        const { valueRanges, commonFieldValueMaxDeviations } = this._config;
        const range = valueRanges[field] || { min: 0, max: 1 }; // Default range if not specified
        const deviation = commonFieldValueMaxDeviations[field] || 0;

        let newValue;

        if (accumulate && lastValue !== null) {
            // Accumulate value with deviation
            const deviationAmount = Math.random() * deviation;
            newValue = lastValue + deviationAmount;
        } else {
            // Independent value generation
            newValue = Math.random() * (range.max - range.min) + range.min;
        }

        // Introduce occasional peaks for stress-related metrics
        if (field === 'stress.score' || field === 'stress.breathingRate') {
            const peakChance = Math.random();
            if (peakChance < 0.1) { // 10% chance of a peak
                newValue += deviation * 2; // Increase by a larger amount
            }
        }

        // Ensure the new value stays within the min/max bounds
        newValue = Math.max(range.min, Math.min(newValue, range.max));

        return newValue;
    }

    /**
     * @method generateSleepData
     * @description Generates sleep data for a specified night period.
     * @returns {Object} - The generated sleep data with duration and quality.
     */
    generateSleepData() {
        const { valueRanges } = this._config;
        const durationRange = valueRanges['sleep.duration'];
        const qualityRange = valueRanges['sleep.quality'];

        const duration = Math.random() * (durationRange.max - durationRange.min) + durationRange.min;
        let quality = Math.random() * (qualityRange.max - qualityRange.min) + qualityRange.min;

        if (this.useTranslatedQualityIndex) {
            quality = this.convertSleepIndex(quality);
        }

        return {
            duration: parseFloat(duration.toFixed(2)),
            quality: this.useTranslatedQualityIndex
                ? quality
                : parseFloat(quality.toFixed(2))
        };
    }

    generateRandomValueForNestedField(mappingValue, lastEntry = {}, generateSleep = false) {
        const randomValues = {};

        Object.keys(mappingValue).forEach(subField => {
            if (generateSleep && subField === 'duration' || subField === 'quality') {
                // If we're generating sleep, skip further processing here; it's handled in generateSleepData.
                return;
            }
            const fieldPath = mappingValue[subField];
            const lastValue = lastEntry[subField] !== undefined ? lastEntry[subField] : null;
            const accumulate = ['caloriesBurned', 'steps'].includes(subField); // Accumulate for these fields

            randomValues[subField] = this.computeValueForField(subField, lastValue, accumulate);
        });

        return randomValues;
    }


    /**
     * @method generateRandomValue
     * @description Generates random values for the fields based on configuration.
     * @param {string} deviceType - The type of the device.
     * @param {Object} fieldMappings - The field mappings for the device.
     * @param {Object} lastEntry - The last entry generated, to use as a baseline for new values.
     * @param {boolean} generateSleep - Whether to generate sleep data (used once per day).
     * @returns {Object} - The object containing all generated values.
     */
    generateRandomValue(deviceType, fieldMappings, lastEntry = {}, generateSleep = false) {
        const deviceFields = fieldMappings[deviceType];
        const randomValues = {};

        Object.keys(deviceFields).forEach(field => {
            const mappingValue = deviceFields[field];
            if (typeof mappingValue === 'object') {
                // Handle nested fields like sleep, stress, etc.
                if (field === 'sleep' && generateSleep) {
                    randomValues[field] = this.generateSleepData();
                } else {
                    randomValues[field] = this.generateRandomValueForNestedField(mappingValue, lastEntry[field] || {}, generateSleep);
                }
            } else {
                const lastValue = lastEntry[field] !== undefined ? lastEntry[field] : null;
                const accumulate = ['caloriesBurned', 'steps'].includes(field); // Accumulate for these fields

                randomValues[field] = this.computeValueForField(field, lastValue, accumulate);
            }
        });

        return randomValues;
    }

    async generateDataBatch(batchStart, batchEnd, intervalMinutes) {
        const now = new Date();
        const data = [];
        const nightHours = [22, 23, 0, 1, 2, 3, 4, 5, 6, 7];  // 10 PM to 7 AM
        const dayOfWeek = now.getDay();  // 0 = Sunday, 6 = Saturday
        const isAfternoonNap = (dayOfWeek === 5 && Math.random() < 0.14);  // Approx. once a week nap on Friday

        let sleepDataGenerated = false;
        const availableFields = this.getFields();

        for (let i = batchStart; i < batchEnd; i++) {
            const timestamp = new Date(now.getTime() - (i + 1) * intervalMinutes * 60 * 1000);
            const currentHour = timestamp.getHours();
            const isSleepingTime = nightHours.includes(currentHour) || isAfternoonNap;

            // Generate values based on the device's fields
            const lastEntry = i === 0 ? {} : data[i - 1];
            const entry = this.generateRandomValue(this.name, fieldMappings, lastEntry, !sleepDataGenerated && isSleepingTime);

            if (isSleepingTime && !sleepDataGenerated) {
                // Ensure fields that shouldn’t be active during sleep are set to 0 or inactive
                if (availableFields.includes('steps')) {
                    entry.steps = 0;
                }
                if (availableFields.includes('caloriesBurned')) {
                    entry.caloriesBurned = 0;
                }
                if (availableFields.includes('activityRings')) {
                    entry.activityRings = {
                        move: 0,
                        exercise: 0,
                        stand: 0
                    };
                }
                if (availableFields.includes('heartRate') && !entry.heartRate) {
                    entry.heartRate = this.computeValueForField('heartRate', 60);  // Assume a stable low heart rate during sleep
                }
                sleepDataGenerated = true;
            }

            const transformedEntry = this.converter.convertEntry(fieldMappings[this.name], timestamp, entry);
            data.push(transformedEntry);
        }

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

        // Generate data batches in parallel
        const batchPromises = [];
        for (let i = 0; i < points; i += batchSize) {
            const batchEnd = Math.min(batchSize + i, points);
            batchPromises.push(this.generateDataBatch(i, batchEnd, intervalMinutes));
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
        const fields = [
            "heartRate", "steps", "caloriesBurned",
            "sleep", "stress", "activity",
            "bloodPressure", "oxygenSaturation", "eeg", "vo2Max", "focusScore", "respiratoryRate"
        ];

        const unifiedStructureConverter = new UnifiedStructureConverter(this);
        const processedData = {
            heartRate: { labels: [], values: [] },
            steps: { labels: [], values: [] },
            caloriesBurned: { labels: [], values: [] },
            sleep: { labels: [], values: [], valuesY1: [] },
            stressLevel: { labels: [], values: [] },
            oxygenSaturation: { labels: [], values: [] },
            bloodPressure: { labels: [], systolic: [], diastolic: [] },
            eeg: { labels: [], alpha: [], beta: [], gamma: [], delta: [], theta: [] },
            vo2Max: { labels: [], values: [] },
            focusScore: { labels: [], values: [] },
            respiratoryRate: { labels: [], values: [] }
        };

        datapoints.forEach(entry => {
            const unifiedData = unifiedStructureConverter.translateToUnifiedStructure(entry.data);
            const timestamp = new Date(entry.timestamp).toLocaleTimeString('en-GB', { timeZone: 'Asia/Jerusalem' }) + ' ' +
                new Date(entry.timestamp).toLocaleDateString('en-GB', { timeZone: 'Asia/Jerusalem' }).replace(/\//g, '-');

            fields.forEach(field => {
                const fieldValue = unifiedStructureConverter.getNestedField(unifiedData, field);
                if (!fieldValue) {
                    return;
                }

                if (field === 'stress') {
                    processedData.stressLevel.labels.push(timestamp);
                    processedData.stressLevel.values.push(fieldValue);
                } else if (field === 'sleep') {
                    processedData.sleep.labels.push(timestamp);
                    processedData.sleep.values.push(fieldValue.duration);
                    processedData.sleep.valuesY1.push(fieldValue.quality);
                } else if (field === 'eeg') {
                    processedData.eeg.labels.push(timestamp);
                    processedData.eeg.alpha.push(fieldValue.alpha);
                    processedData.eeg.beta.push(fieldValue.beta);
                    processedData.eeg.gamma.push(fieldValue.gamma);
                    processedData.eeg.delta.push(fieldValue.delta);
                    processedData.eeg.theta.push(fieldValue.theta);
                } else if (field === 'bloodPressure') {
                    processedData.bloodPressure.labels.push(timestamp);
                    processedData.bloodPressure.systolic.push(fieldValue.systolic);
                    processedData.bloodPressure.diastolic.push(fieldValue.diastolic);
                } else if (processedData[field]) {
                    processedData[field].labels.push(timestamp);
                    processedData[field].values.push(fieldValue);
                }
            });
        });

        return processedData;
    }

}
