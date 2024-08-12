import express from 'express';
import container from '../containerConfig.js';

/**
 * @class UserRouter
 * @description Configures user-related routes with authentication middleware and controller.
 */
class UserRouter {
    /**
     * @constructor
     * @description Initializes the router, sets up controllers and middleware, and registers routes.
     */
    constructor() {
        this._router = express.Router();
        this.userController = container.get('userController');
        this.authMiddleware = container.get('authMiddleware');
        this._registerRoutes();
    }

    /**
     * @method getRouter
     * @returns {express.Router} - The configured Express router.
     */
    getRouter() {
        return this._router;
    }

    /**
     * @method _registerRoutes
     * @description Registers user-related routes with authentication middleware.
     * @private
     */
    _registerRoutes() {
        this._router.get('/average-devices-data', this.authMiddleware.authenticateJWT, this.userController.getAverageDataAllDevices);
        this._router.get('/linked-devices', this.authMiddleware.authenticateJWT, this.userController.getLinkedDevices);
        this._router.post('/link-device', this.authMiddleware.authenticateJWT, this.userController.linkDevice);
        this._router.post('/unlink-device/:deviceId', this.authMiddleware.authenticateJWT, this.userController.unlinkDevice);
        this._router.get('/device-data/:deviceId', this.authMiddleware.authenticateJWT, this.userController.getDeviceData);
        this._router.get('/health-story', this.authMiddleware.authenticateJWT, this.userController.getHealthStory);
    }
}

export default UserRouter;
