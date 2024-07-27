export default class Device {
    constructor(id) {
        this.id = id;
        this.data = {};
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
