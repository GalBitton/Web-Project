import rateLimit from 'express-rate-limit';
import config from "config";
import {convertExpirationDateToMilliseconds} from "../utils/expirationDateConverter.js";
const limiterConfig = config.get("limiterLogic");

/**
 * Rate limiter for general API requests.
 * @type {import('express-rate-limit').RateLimit}
 */
const limiter = rateLimit({
    windowMs: convertExpirationDateToMilliseconds(limiterConfig.limiter.timeWindowMs),
    limit: limiterConfig.limiter.maxRequests,
    message: 'Too many requests, please try again later.',
});

/**
 * Rate limiter for registration attempts.
 * @type {import('express-rate-limit').RateLimit}
 */
const registerLimiter = rateLimit({
    windowMs: convertExpirationDateToMilliseconds(limiterConfig.registerLimits.timeWindowMs),
    max: limiterConfig.registerLimits.maxRequests,
    message: 'Too many registration attempts from this IP address, please try again later.',
});

/**
 * Rate limiter for login attempts.
 * @type {import('express-rate-limit').RateLimit}
 */
const loginLimiter = rateLimit({
    windowMs: convertExpirationDateToMilliseconds(limiterConfig.loginLimits.timeWindowMs),
    max: limiterConfig.loginLimits.maxRequests,
    message: 'Too many login attempts from this IP address, please try again later.',
});

export {
    limiter,
    registerLimiter,
    loginLimiter
}
