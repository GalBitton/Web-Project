import '../vercel-setup.js';
import container from '../containerConfig.js';

const server = container.get('server');
const logger = container.get('logger');

process.on('uncaughtException', (err) => {
    const message = `Uncaught Exception: ${err} - stack: ${err.stack}`;
    logger.error(message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    const stack = reason instanceof Error && reason.stack ? reason.stack : 'No stack trace';
    const message = `Unhandled Rejection at: ${promise}, reason: ${reason}, stack: ${stack}`;
    logger.error(message);
});

server.run();
