import express from 'express';
import { registerLimiter, loginLimiter } from '../middlewares/rateLimiters.middleware.js';

/**
 * @class AuthRouter
 * @description Sets up authentication routes with associated middleware and controllers.
 */
class AuthRouter {
    /**
     * @constructor
     * @param {Object} authController - Instance of the authentication controller.
     * @param {Object} authMiddleware - Instance of the authentication middleware.
     */
    constructor(authController, authMiddleware) {
        this._router = express.Router();
        this.authController = authController;
        this.authMiddleware = authMiddleware;
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
     * @description Registers routes for authentication endpoints with rate limiting middleware.
     * @private
     */
    _registerRoutes() {
        this._router.post('/register', registerLimiter, this.authController.register);
        this._router.post('/authenticate', loginLimiter, this.authController.authenticate);
        this._router.post('/authenticate-google', loginLimiter, this.authController.authenticateGoogleToken);
        this._router.post('/refresh', loginLimiter, this.authController.refresh);
        this._router.post('/logout', loginLimiter, this.authController.logout);
    }
}

export default AuthRouter;
