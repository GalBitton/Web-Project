import { ControllerService } from "@/services/api/ControllerService";

/**
 * Service class for handling API requests.
 */
class APIService {
    /**
     * Creates an instance of APIService.
     *
     * @param {Object} request - The request object containing details for the API call.
     * @param {string} request.action - The action to perform (e.g., 'login', 'register').
     * @param {string} [request.email] - The email address for login or registration.
     * @param {string} [request.password] - The password for login or registration.
     * @param {string} [request.idToken] - The Google ID token for Google login.
     * @param {string} [request.deviceId] - The device ID for fetching or unlinking device data.
     * @param {string} [request.brand] - The brand of the device to link.
     * @param {string} [request.type] - The type of the device to link.
     */
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
            case 'linkDevice':
                this.callback = controller.linkDevice;
                this.parameters.push(this.request.brand);
                this.parameters.push(this.request.type);
                break;
            case 'unlinkDevice':
                this.callback = controller.unlinkDevice;
                this.parameters.push(this.request.deviceId);
                break;
            case 'getHealthStory':
                this.callback = controller.getHealthStory;
                break;
            default:
                break;
        };
    }

    /**
     * Executes the API request based on the initialized action and parameters.
     *
     * @returns {Promise<any>} The result of the API request.
     */
    async execute() {
        if (this.callback) {
            return await this.callback(...this.parameters);
        }
    }
}

export default APIService;
