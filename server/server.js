'use strict';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import connect from "./database/connect.js";
import container from './containerConfig.js';
import { errorHandler, limiter } from "./middlewares/index.js";

export default class Server {
    constructor(config, logger) {
        this._app = express();
        this._config = config;
        this._logger = logger;
        this._port = this._config.port;
        this._dirname = dirname(fileURLToPath(import.meta.url));
        this._setupEJS();
        this._setupPolicies();
        this._setupRoutes();
        this._setupMiddlewares();
    }

    run() {
        try {
            connect(this._config.db_uri, this._logger);
            this._app.listen(this._port, () => {
                this._logger.info(`Server Public URL: http://${this._config.host}:${this._port}, listening on port ${this._port}. Environment: ${process.env.NODE_ENV}.`);
            });
        } catch (error) {
            console.error(error);
        }
    }

    _setupEJS() {
        this._app.set('view engine', 'ejs');
        this._app.set('views', path.join(this._dirname, 'views'));
    }

    _setupPolicies() {
        this._app.use(express.json({ limit: "400kb"}));
        this._app.use(cookieParser());
        this._app.use(cors({ origin: true, credentials: true }));
        this._app.use(helmet({
            crossOriginOpenerPolicy: true
        }));
        this._app.use('/robots.txt', express.static('robots.txt'));
        this._app.use(helmet.noSniff());
        this._app.use(helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        }));
        this._app.use(
            express.static(path.join(this._dirname, "..", "client", "dist", 'index.html'))
        );
    }

    _setupRoutes() {
        this._app.get('/', (req, res) => {
            if (["staging", "production"].includes(process.env.NODE_ENV) && !req.secure) {
                res.redirect(301, "https://" + req.headers.host + req.originalUrl);
            }
            res.render('index.ejs');
        });

        this._app.get(['/.env', '/config/*', '/.git/*', '/*.json'], (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null) || req.ip;
            this._logger.info(`IP Address ${ip} tried to access a sensitive file at ${req.url}.\nMethod: ${req.method}\nstatus: ${req.statusCode}\nHeaders: ${JSON.stringify(req.headers)}\nQuery: ${JSON.stringify(req.query)}`);
            res.status(403).send('Access denied');
        });

        this._app.use('/auth', container.get('authRouter').getRouter());
        this._app.use('/user', container.get('userRouter').getRouter());
    }

    _setupMiddlewares() {
        this._app.use(limiter);
        this._app.use(errorHandler);
    }
}
