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
        if (qualityIndex <= 2) {
            return "Excellent";
        } else if (qualityIndex <= 4) {
            return "Good";
        } else if (qualityIndex <= 6) {
            return "Fair";
        } else if (qualityIndex <= 8) {
            return "Poor";
        } else {
            return "Very Poor";
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
