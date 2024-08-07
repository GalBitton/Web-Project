export default class Device {
    constructor(config, logger, id) {
        this._config = config;
        this._logger = logger;

        this.id = id;
        this.data = {};
        this.lastSeeded = null; // Store the timestamp of the last seeding
        this.randomCache = {}; // Cache for precomputed random values
        this.intermediateResults = {}; // Cache for intermediate results
    }

    translateQualityIndex(qualityIndex) {
        if (qualityIndex <= 0.25) {
            return "Very Poor";
        } else if (qualityIndex <= 0.5) {
            return "Poor";
        } else if (qualityIndex <= 0.75) {
            return "Fair";
        } else if (qualityIndex <= 1.00) {
            return "Good";
        } else {
            return "Excellent";

        }
    }

    // Abstract method to be implemented by subclasses
    getFieldValue(entry, field) {
        throw new Error("Method 'getFieldValue()' must be implemented.");
    }

    getFields() {
        return ["timestamp", "heartRate", "steps", "caloriesBurned"];
    }

    precomputeRandomValues(fields, count) {
        const ranges = this._config.valueRanges;
        const deviations = this._config.commonFieldValueMaxDeviations;
        for (const field of fields) {
            if (!this.randomCache[field]) {
                this.randomCache[field] = [];
            }
            for (let i = 0; i < count; i++) {
                let baseValue = Math.random() * (ranges[field].max - ranges[field].min) + ranges[field].min;
                if (deviations[field] !== undefined) {
                    baseValue += Math.random() * deviations[field] - (deviations[field] / 2);
                }
                this.randomCache[field].push(baseValue);
            }
        }
    }

    generateDataForField(field, index) {
        if (!this.intermediateResults[field]) {
            this.intermediateResults[field] = this.randomCache[field][index % this.randomCache[field].length];
        }
        return this.intermediateResults[field];
    }

    async generateDataBatch(points, intervalMinutes, fields, batchSize) {
        const now = new Date();
        const data = [];

        // Precompute random values asynchronously
        this.precomputeRandomValues(fields, points);

        for (let batchStart = 0; batchStart < points; batchStart += batchSize) {
            const batchEnd = Math.min(batchStart + batchSize, points);
            const batchPromises = [];

            for (let i = batchStart; i < batchEnd; i++) {
                const entry = {};
                for (const field of fields) {
                    if (field === "timestamp") {
                        entry[field] = new Date(now.getTime() - (i + 1) * intervalMinutes * 60 * 1000).toISOString();
                    } else {
                        batchPromises.push(new Promise(resolve => {
                            entry[field] = this.generateDataForField(field, i);
                            resolve();
                        }));
                    }
                }
                data.push(entry);
            }

            await Promise.all(batchPromises);
        }

        return data;
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
        this.lastSeeded = now; // Update the last seeded timestamp
    }

    extractGraphData(datapoints) {
        const fields = ["heartRate", "steps", "caloriesBurned", "sleep", "bloodPressure", "activityRings", "stress", "oxygenSaturation", "EEG"];
        const processedData = {};

        for (const field of fields) {
            const values = datapoints.map(entry => this.getFieldValue(entry.data, field));

            if (values.every(value => value === 0)) {
                processedData[field] = {labels: [], values: []};
                continue;
            }

            const labels = datapoints.map(entry => {
                const date = new Date(entry.timestamp);
                return `${date.toLocaleTimeString('en-GB')} ${date.toLocaleDateString('en-GB').replace(/\//g, '-')}`;
            });


            processedData[field] = { labels, values };
        }

        return processedData;
    }
}
