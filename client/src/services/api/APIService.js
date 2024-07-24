import { ControllerService } from "@/services/api/ControllerService";

class APIService {
    constructor(request, axiosInstance) {
        this.request = request;
        this.parameters = [];
        this.callback = null;

        const controller = ControllerService(axiosInstance);

        switch (request.action) {
            case 'logout':
                this.callback = controller.logout;
                break;
            case 'refreshToken':
                this.callback = controller.refreshToken;
                break;
            case 'getLinkedDevices':
                this.callback = controller.getLinkedDevices;
                break;
            case 'getAverageDataAllDevices':
                this.callback = controller.getAverageDataAllDevices;
                break;
            case 'getDeviceData':
                this.callback = controller.getDeviceData;
                this.parameters.push(this.request.deviceId);
                break;
            default:
                break;
        }
    }

    async execute() {
        if (this.callback) {
            try {
                return await this.callback(...this.parameters);
            } catch (err) {
                console.error(err);
                return { error: err.message };
            }
        }
    }
}

export default APIService;
