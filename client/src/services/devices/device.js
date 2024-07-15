export default class Device {
    constructor(data) {
        this.data = data;
    }

    calculateAverage(field) {
        const total = this.data.reduce((sum, entry) => {
            if (field === 'sleep') {
                return sum + this.getFieldValue(entry, field).duration;
            }
            return sum + this.getFieldValue(entry, field);
        }, 0);
        return (total / this.data.length).toFixed(2);
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

    static async fetchData(file) {
        const response = await fetch(file);
        const data = await response.json();
        return data.data;
    }
}
