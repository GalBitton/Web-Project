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
        this._router.get('/device-data/:deviceId', this.authMiddleware.authenticateJWT, this.userController.getDeviceData);
    }
}

export default UserRouter;
