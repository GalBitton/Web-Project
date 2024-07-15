'use strict';

import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
const cookieParser = require('cookie-parser');

import {} from "./routes";
import connectToDB from "./db";
import { errorHandler, limiter } from "./middleware/";

export default class Server {
    constructor(config, logger) {
        this._app = express();
        this._config = config;
        this._logger = logger;
        this._port = this._config.port;
        this._setupLogger();  
        this._setupEJS();
        this._setupPolicies();
        this._setupRoutes();
        this._setupMiddlewares();
    }

    run() {
        try {
            connectToDB(this._config.db.uri);
            this._app.listen(port, () => {
                console.log(`Server listening on port ${this._port}.`, true);
            })
        } catch (error) {
            console.error(error);
        }
    }

    _setupEJS() {
        this._app.set('view engine', 'ejs');
        this._app.set('views', path.join(__dirname, 'views'));
    }

    _setupPolicies() {
        this._app.use(express.json({ limit: "400kb"}));
        this._app.use(cookieParser());
        this._app.use(cors({ origin: true, credentials: true }));
        this._app.use(helmet({
            crossOriginOpenerPolicy: true
        }));
        this._app.use(helmet.noSniff());
        this._app.use(helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        }));
        this._app.use(
            express.static(path.join(__dirname, "..", "client", "dist", 'index.html'))
        );
    }

    _setupRoutes() {

        this._app.get('/', (req, res) => {
            if (!req.secure) {
                res.redirect(301, "https://" + req.headers.host + req.originalUrl);
            }
            res.render('index.ejs');
        });

        this._app.get(['/.env', '/config/*', '/.git/*', '/*.json'], (req, res) => {
            console.error(`IP Address ${req.ip} tried to access a sensitive file: ${req.url}`, req);
            res.status(403).send('Access denied');
        });
    }

    _setupMiddlewares() {
        this._app.use(limiter);
        this._app.use(errorHandler);
    }

    overrideConsole() {
        // Override console.error and console.log
        const originalConsoleLog = console.log;

        console.error = function(message, request = null) {
            logger.error(message, { request });
        }

        console.log = function(message, toLog = false) {
            if (toLog) {
                logger.info(message);
            }
            originalConsoleLog(message);
        }
    }
}
