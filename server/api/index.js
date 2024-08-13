/**
 * Entry point for the application.
 *
 * This script initializes the server and sets up global error handling for uncaught exceptions and unhandled promise rejections.
 *
 * - Imports necessary modules and configurations.
 * - Retrieves the server and logger instances from the container.
 * - Sets up an `uncaughtException` handler to log and exit the process in case of uncaught exceptions.
 * - Sets up an `unhandledRejection` handler to log unhandled promise rejections.
 * - Starts the server by calling its `run` method.
 *
 * @module
 */

import '../vercel-setup.js';
import container from '../containerConfig.js';

// Retrieve the server and logger instances from the container
const server = container.get('server');
const logger = container.get('logger');

/**
 * Handles uncaught exceptions.
 *
 * Logs the exception and its stack trace, then exits the process with a failure code.
 *
 * @param {Error} err - The uncaught exception.
 */
process.on('uncaughtException', (err) => {
    const message = `Uncaught Exception: ${err} - stack: ${err.stack}`;
    logger.error(message);
    process.exit(1);
});

/**
 * Handles unhandled promise rejections.
 *
 * Logs the reason for the rejection, the promise that was rejected, and its stack trace if available.
 *
 * @param {any} reason - The reason for the promise rejection.
 * @param {Promise} promise - The promise that was rejected.
 */
process.on('unhandledRejection', (reason, promise) => {
    const stack = reason instanceof Error && reason.stack ? reason.stack : 'No stack trace';
    const message = `Unhandled Rejection at: ${promise}, reason: ${reason}, stack: ${stack}`;
    logger.error(message);
});

server.run();
