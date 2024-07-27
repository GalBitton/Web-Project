import APIService from "@/services/api/APIService";

export default class Device {
    constructor(id) {
        this.id = id;
        this.data = {};
    }

    async fetchData() {
        const apiService = new APIService({action: 'getDeviceData', deviceId: this.id});
        this.data = await apiService.execute();
    }
}
