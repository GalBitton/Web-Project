/**
 * Middleware exports for error handling and rate limiting.
 * @module middlewares
 */

import errorHandler from "./errorHandler.middleware.js";
import { limiter } from "./rateLimiters.middleware.js";

/**
 * Error handling middleware.
 * @type {Function}
 */
export {
    errorHandler,
    limiter
};