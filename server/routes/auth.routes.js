import express from 'express';
const router = express.Router();

import { registerLimiter, loginLimiter } from '../middlewares/rateLimiters.middleware.js';
import {
    register,
    authenticate,
    authenticateGoogleToken,
    refresh,
    logout
} from '../controllers/auth.controller.js';
import authenticateJWT from '../middlewares/auth.middleware.js';

router.post('/register', registerLimiter, register);
router.post('/authenticate', loginLimiter, authenticate);
router.post('/authenticate-google', loginLimiter, authenticateGoogleToken);
router.post('/refresh', loginLimiter, refresh);
router.post('/logout', loginLimiter, authenticateJWT, logout);

export const authRouter = router;