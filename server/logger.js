'use strict';

import 'winston-mongodb';
import mongoose from 'mongoose';
import winston, { format } from 'winston';
import 'winston-daily-rotate-file';

const logFormat = format.printf(({ timestamp, level, message, request }) => {
    // Clone request.body and remove or mask sensitive fields
    let bodyString = '';
    if (request?.body) {
        const safeBody = { ...request.body };
        if (safeBody?.password) {
            safeBody.password = '[REDACTED]'; // Masking the password
        }
        bodyString = `body: ${JSON.stringify(safeBody, null, 2)}`;
    }

    const userIdPart = request?.user ? `[Provided User ID: ${request.user}]` : '';
    const requestData = request ? `\n\t\tUrl: ${request.url},\n\t\tmethod: ${request.method},\n\t\tparameters: ${JSON.stringify(request.params, null, 12)},\n\t\t${bodyString}` : '';
    const formattedRequest = requestData === '' ? '' : `Request - ${requestData}`;

    return `[${timestamp}] ${level}: ${message} ${userIdPart}\n${formattedRequest}\n`;
});

class Logger {
    constructor(config) {
        this.logger = null;
        this.config = config;
        this._createLogger();
    };

    _createLogger() {
        const options = this.config.log2file ? {
            filename: 'logs/%DATE%.txt',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '2m',
            level: this.config.level,
        } : {
            db: mongoose.connection.useDb('logs'),
            options: { useUnifiedTopology: true },
            collection: 'logs',
            capped: false,
            leaveConnectionOpen: true
        };

        const transport = this.config.log2file ?
            new winston.transports.DailyRotateFile(options) :
            new winston.transports.MongoDB(options);

        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                logFormat
            ),
            transports: [
                transport
            ],
        });
    };

    log(level, message, request) {
        this.logger.log({ level, message, request });
    }

    error(message, request) {
        this.logger.error(message, { request });
    }

    warn(message, request) {
        this.logger.warn(message, { request });
    }

    info(message, request) {
        this.logger.info(message, {request});
    }

    debug(message, request) {
        this.logger.debug(message, {request});
    }
}

export default Logger;