import express from 'express';
import container from '../containerConfig.js';

class UserRouter {
    constructor() {
        this._router = express.Router();
        this.userController = container.get('userController');
        this.authMiddleware = container.get('authMiddleware');
        this._registerRoutes();
    }

    getRouter() {
        return this._router;
    }

    _registerRoutes() {
        this._router.get('/average-devices-data', this.authMiddleware.authenticateJWT, this.userController.getAverageDataAllDevices);
        this._router.get('/linked-devices', this.authMiddleware.authenticateJWT, this.userController.getLinkedDevices);
        this._router.post('/link-device', this.authMiddleware.authenticateJWT, this.userController.linkDevice);
        this._router.post('/unlink-device/:deviceId', this.authMiddleware.authenticateJWT, this.userController.unlinkDevice);
        this._router.get('/device-data/:deviceId', this.authMiddleware.authenticateJWT, this.userController.getDeviceData);
        this._router.get('/health-status', this.authMiddleware.authenticateJWT, this.userController.getHealthStatus);
    }
}

export default UserRouter;
