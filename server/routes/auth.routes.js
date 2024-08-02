import express from 'express';
import { registerLimiter, loginLimiter } from '../middlewares/rateLimiters.middleware.js';
import container from '../containerConfig.js';

class AuthRouter {
    constructor(authController, authMiddleware) {
        this._router = express.Router();
        this.authController = authController;
        this.authMiddleware = authMiddleware;
        this._registerRoutes();
    }

    getRouter() {
        return this._router;
    }

    _registerRoutes() {
        this._router.post('/register', registerLimiter, this.authController.register);
        this._router.post('/authenticate', loginLimiter, this.authController.authenticate);
        this._router.post('/authenticate-google', loginLimiter, this.authController.authenticateGoogleToken);
        this._router.post('/refresh', loginLimiter, this.authController.refresh);
        this._router.post('/logout', loginLimiter, this.authController.logout);
    }
}

export default AuthRouter;
