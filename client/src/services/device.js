import APIService from "@/services/api/APIService";
import DataAnalytics from "@/services/DataAnalytics";

export default class Device {
    constructor(id) {
        this.id = id;
        this.analytics = new DataAnalytics();
    }

    async fetchAnalyzeData() {
        const apiService = new APIService({action: 'getDeviceData', deviceId: this.id});
        const data = await apiService.execute();
        this.analytics.analyzeData(data);
    }

    getAnalysisData(field) {
        return this.analytics.getAnalysisData(field);
    }

    getAnalysisSummary(field){
        return this.analytics.getAnalysisSummary(field);
    }
}
