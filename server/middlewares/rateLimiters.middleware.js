import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 500,
    message: 'Too many requests, please try again later.',
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15,
    message: 'Too many registration attempts from this IP address, please try again later.',
});

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: 'Too many login attempts from this IP address, please try again later.',
});

const protectedLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    message: 'Too many requests, please try again later.',
});

export {
    limiter,
    registerLimiter,
    loginLimiter,
    protectedLimiter
}
