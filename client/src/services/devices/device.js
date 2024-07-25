import APIService from "@/services/api/APIService";

export default class Device {
    constructor(id) {
        this.id = id;
        this.data = [];
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

    async fetchData() {
        const apiService = new APIService({action: 'getDeviceData', deviceId: this.id});
        this.data = await apiService.execute();
    }
}
