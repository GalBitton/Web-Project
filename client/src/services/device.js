import APIService from "@/services/api/APIService";
import DataAnalytics from "@/services/DataAnalytics";

/**
 * Class representing a device with data analytics.
 */
export default class Device {
    /**
     * Creates an instance of Device.
     * @param {string} id - The unique identifier for the device.
     */
    constructor(id) {
        this.id = id;
        this.analytics = new DataAnalytics();
    }

    /**
     * Fetches and analyzes data for the device from the API.
     * @async
     * @returns {Promise<void>} A promise that resolves when the data has been fetched and analyzed.
     */
    async fetchAnalyzeData() {
        // Note: We can sync the data with the new datapoints by checking if X minutes passed since the last timestamp in the data
        // And then we can fetch the new datapoints from the server and destructure the data to the existing data.
        // We did not do so here because of the time constraint.
        if (this.analytics.hasData()) {
            return;
        }

        const apiService = new APIService({ action: 'getDeviceData', deviceId: this.id });
        const data = await apiService.execute();
        this.analytics.analyzeData(data);
    }

    /**
     * Gets the analysis data for a specific field.
     * @param {string} field - The field to get data for. Possible values are 'heartRate', 'steps', 'caloriesBurned', 'sleep', 'stressLevel', 'oxygenSaturation', 'bloodPressure', 'eeg'.
     * @returns {Object|string} The data for the specified field or 'Unknown type' if the field is not recognized.
     */
    getAnalysisData(field) {
        return this.analytics.getAnalysisData(field);
    }

    /**
     * Gets a summary of the analysis data for a specific field within a time frame.
     * @param {string} field - The field to get the summary for. Possible values are 'heartRate', 'steps', 'caloriesBurned', 'sleep', 'stressLevel', 'oxygenSaturation', 'bloodPressure', 'eeg'.
     * @param {string|undefined} [startTime] - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} [endTime] - The end time of the time frame in ISO 8601 format.
     * @returns {string} The summary for the specified field or 'Unknown type' if the field is not recognized.
     */
    getAnalysisSummary(field) {
        return this.analytics.getAnalysisSummary(field);
    }
}
