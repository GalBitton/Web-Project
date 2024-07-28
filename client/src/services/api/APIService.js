import { ControllerService } from "@/services/api/ControllerService";

class APIService {
    constructor(request) {
        this.request = request;
        this.parameters = [];
        this.callback = null;

        const controller = ControllerService();

        switch (request.action) {
            case 'login':
                this.callback = controller.login;
                this.parameters.push(this.request.email);
                this.parameters.push(this.request.password);
                break;
            case 'login-google':
                this.callback = controller.loginGoogle;
                this.parameters.push(this.request.idToken);
                break;
            case 'register':
                this.callback = controller.register;
                this.parameters.push(this.request.email);
                this.parameters.push(this.request.password);
                break;
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
            return await this.callback(...this.parameters);
        }
    }
}

export default APIService;
