export default class Device {
    constructor(data) {
        this.data = data;
    }

    calculateAverage(field) {
        const total = this.data.reduce((sum, entry) => sum + this.getFieldValue(entry, field), 0);
        return (total / this.data.length).toFixed(2);
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