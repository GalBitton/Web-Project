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
        this._config = config;
        this._createLogger();
    };

    _createLogger() {
        const FileOptions = {
            filename: 'logs/%DATE%.txt',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '2m',
            level: this._config.level,
        };

        const MongoDBOptions = {
            db: mongoose.connection.useDb('neurosync'),
            options: { useUnifiedTopology: true },
            collection: 'logs',
            capped: false,
            leaveConnectionOpen: true,
            level: this._config.level,
        };

        let logTransports = [];
        const mongoDBTransport = new winston.transports.MongoDB(MongoDBOptions);
        const consoleTransport = new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        });

        if (this._config.log2file) {
            logTransports.push(new winston.transports.DailyRotateFile(FileOptions))
        }
        logTransports.push(consoleTransport);
        logTransports.push(mongoDBTransport);

        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                logFormat
            ),
            transports: logTransports
        });
    };
}

export default Logger;
