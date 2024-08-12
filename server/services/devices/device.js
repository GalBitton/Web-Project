import { translateSleepIndex } from "../../utils/sleepTranslation.js";

export default class Device {
    constructor(config, logger, id, name, lastSeeded) {
        this._config = config;
        this._logger = logger;

        this.name = name;
        this.id = id;
        this.data = [];
        this.lastSeeded = lastSeeded; // Store the timestamp of the last seeding
        this.randomCache = {}; // Cache for precomputed random values
    }

    convertSleepIndex(qualityIndex) {
        return translateSleepIndex(qualityIndex);
    }

    // Abstract method to be implemented by subclasses
    getFieldValue(entry, field) {if (entry[field] === undefined) {
            return 0;
        }
        throw new Error("Method 'getFieldValue()' must be implemented.");
    }

    getFields() {
        return ["heartRate", "steps", "caloriesBurned"];
    }

    _computeRandomValue(field) {
        const ranges = this._config.valueRanges;
        return Math.random() * (ranges[field].max - ranges[field].min) + ranges[field].min;
    }

    // Abstract method to be implemented by subclasses
    generateDataForField(field) {
        return this._computeRandomValue(field);
    }

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
    getPrecomputedDataForField(field, index) {
        return this.randomCache[field][index];
    }

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
