'use strict';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import connect from "./database/connect.js";
import container from './containerConfig.js';
import { errorHandler, limiter } from "./middlewares/index.js";

/**
 * Server class for initializing and running the Express server.
 * @class
 */
export default class Server {
    /**
     * Creates an instance of Server.
     * @param {Object} config - Server configuration.
     * @param {Object} logger - Logger instance.
     */
    constructor(config, logger) {
        this._app = express();
        this._config = config;
        this._logger = logger;
        this._port = this._config.port;
        this._hostname = 'localhost';
        this._setupPolicies();
        this._setupRoutes();
        this._setupMiddlewares();
    }

    /**
     * Starts the server and connects to the database.
     */
    run() {
        try {
            connect(this._config.db_uri, this._logger);
            this._app.listen(this._port, () => {
                this._logger.info(`Server running on port http://${this._hostname}:${this._port}. Environment: ${process.env.NODE_ENV}.`);
                this._logger.info(`Swagger UI available at http://${this._hostname}:${this._port}/api-docs`);
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Returns CORS options.
     * @private
     * @returns {Object} - CORS options.
     */
    _getCorsOptions() {
        return {
            origin: true,
            credentials: true,
        };
    }

    /**
     * Sets up security policies and static file serving.
     * @private
     */
    _setupPolicies() {
        const corsOptions = this._getCorsOptions();

        this._app.use(express.json({ limit: "2mb" } ));
        this._app.use(cookieParser());
        this._app.use(cors(corsOptions));
        this._app.use(helmet({
            crossOriginOpenerPolicy: true
        }));
        this._app.use('/robots.txt', express.static('public/robots.txt'));
        this._app.use(helmet.noSniff());
        this._app.use(helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        }));
    }

    /**
     * Sets up the server routes and Swagger UI.
     * @private
     */
    _setupRoutes() {
        this._app.get(['/.env', '/config/*', '/.git/*', '/*.json'], (req, res) => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null) || req.ip;
            this._logger.info(`IP Address ${ip} tried to access a sensitive file at ${req.url}.\nMethod: ${req.method}\nstatus: ${req.statusCode}\nHeaders: ${JSON.stringify(req.headers)}\nQuery: ${JSON.stringify(req.query)}`);
            res.status(403).send('Access denied');
        });

        this._app.use('/auth', container.get('authRouter').getRouter());
        this._app.use('/user', container.get('userRouter').getRouter());

        // Swagger
        this._hostname = process.env.VERCEL_URL || process.env.HOSTNAME || 'localhost';
        const cssUrl = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
        const options = {
            customCss:
                '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
            customCssUrl: cssUrl,
        };
        const specs = YAML.load(path.join(process.cwd(), 'public', 'docs', 'swagger.yaml'));
        specs.servers = [
            {
                url: `http://${this._hostname}:${this._port}`,
                description: `${process.env.NODE_ENV} server`,
            },
        ];
        this._app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, options));
    }

    /**
     * Sets up middlewares for rate limiting and error handling.
     * @private
     */
    _setupMiddlewares() {
        this._app.use(limiter);
        this._app.use(errorHandler);
    }
}
