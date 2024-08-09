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

    translateSleepQualityIndex(qualityIndex) {
        if (qualityIndex <= 0.3) {
            return "Very Poor";
        } else if (qualityIndex <= 0.6) {
            return "Poor";
        } else if (qualityIndex <= 0.8) {
            return "Fair";
        } else if (qualityIndex <= 0.9) {
            return "Good";
        } else if (qualityIndex <= 1.00) {
            return "Excellent";
        } else {
            return "Unknown";
        }
    }

    // Abstract method to be implemented by subclasses
    getFieldValue(entry, field) {
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
            if (!this.randomCache[field]) {
                this.randomCache[field] = [];
            }

            for (let i = 0; i < count; i++) {
                let baseValue = this.generateDataForField(field);
                if (deviations[field] !== undefined) {
                    baseValue += Math.random() * (deviations[field] + 1);
                }
                this.randomCache[field].push(baseValue);
            }
        }
    }
    getPrecomputedDataForField(field, index) {
        return this.randomCache[field][index];
    }
    async generateDataBatch(points, intervalMinutes, fields, batchSize) {
        const now = new Date();
        const accumulatedData = [];

        // Precompute random values asynchronously
        this.precomputeRandomValues(fields, points);

        for (let batchStart = 0; batchStart < points; batchStart += batchSize) {
            const batchEnd = Math.min(batchStart + batchSize, points);
            const data = [];
            const batchPromises = [];

            for (let i = batchStart; i < batchEnd; i++) {
                const entry = {};
                const fieldPromises = fields.map(field =>
                    new Promise(resolve => {
                        entry[field] = this.getPrecomputedDataForField(field, i);
                        resolve();
                    })
                );

                // Wait for all field promises to resolve before pushing the entry to data
                batchPromises.push(Promise.all(fieldPromises).then(() => {
                    entry["timestamp"] = new Date(now.getTime() - (i + 1) * intervalMinutes * 60 * 1000).toISOString();
                    data.push(entry);
                }));
            }

            // Wait for all batch promises to resolve before continuing
            await Promise.all(batchPromises);
            accumulatedData.push(...data);
        }

        return accumulatedData;
    }
    async seedDatabase() {
        const now = new Date();
        const intervalMinutes = parseInt(this._config.timeWindowMinutes) / parseInt(this._config.points);
        const batchSize = this._config.batchSize || 10; // Default batch size if not specified

        let points;
        if (this.lastSeeded) {
            const timeElapsed = Math.floor((now - this.lastSeeded) / (60 * 1000));
            points = Math.floor(timeElapsed / intervalMinutes);
        } else {
            points = this._config.points;
        }

        const fields = this.getFields();
        this.data = await this.generateDataBatch(points, intervalMinutes, fields, batchSize);
        this._logger.debug(`Seeded ${this.data.length} data points for ${this.name} device.`);
        this._logger.debug(`Data points: ${JSON.stringify(this.data, null, 4)}`);
        this.lastSeeded = now; // Update the last seeded timestamp
        return this.data;
    }

    extractGraphData(datapoints) {
        const fields = ["heartRate", "steps", "caloriesBurned", "sleep", "bloodPressure", "activityRings", "stress", "oxygenSaturation", "EEG"];
        const processedData = {};

        for (const field of fields) {
            const values = datapoints.map(entry => {
                return {
                    timestamp: entry.timestamp,
                    data: this.getFieldValue(entry.data, field)
                }
            });

            if (values.every(value => value.data === 0)) {
                processedData[field] = {labels: [], values: []};
                continue;
            }

            const labels = values.map(value => {
                const date = new Date(value.timestamp);
                return `${date.toLocaleTimeString('en-GB')} ${date.toLocaleDateString('en-GB').replace(/\//g, '-')}`;
            });


            processedData[field] = { labels, values };
        }

        return processedData;
    }
}
