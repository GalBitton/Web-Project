import APIService from "@/services/api/APIService";
import dataAnalytics from "@/services/dataAnalytics";

export default class Device {
    constructor(id) {
        this.id = id;
        this.data = {};
        this.analytics = new dataAnalytics();
    }

    async fetchData() {
        const apiService = new APIService({action: 'getDeviceData', deviceId: this.id});
        this.data = await apiService.execute();
        this.analytics.analyzeData(this.data);
    }

    getAnalysisSummary(field){
        return this.analytics.getAnalysisSummary(field);
    }
}
