// IoC Container
'use strict';

import container from 'kontainer-di';
import serviceData from './package.json' assert { type: "json" };
import config from 'config';
import Logger from './logger.js';
import Server from './server.js';

import AuthController from './controllers/auth.controller.js';
import UserController from './controllers/user.controller.js';

import AuthMiddleware from "./middlewares/auth.middleware.js";

import AuthRouter from "./routes/auth.routes.js";
import UserRouter from "./routes/user.routes.js";

const serverConfig = config.get("server");
const loggerConfig = config.get("logger");
const authConfig = config.get("auth");

const loggerClass = new Logger(loggerConfig);

container.register('serviceData', [], serviceData);
container.register('serviceName', [], serviceData.name);
container.register('vercelAllowedOrigins', [], config.get("vercelAllowedOrigins"));
container.register('authConfig', [], authConfig);
container.register('loggerConfig', [], loggerConfig);
container.register('logger', [], loggerClass.logger);
container.register('authMiddleware', ['authConfig', 'logger'], AuthMiddleware);
container.register('authController', ['authConfig', 'logger'], AuthController);
container.register('authRouter', [], AuthRouter);
container.register('userController', ['authConfig', 'logger'], UserController);
container.register('userRouter', [], UserRouter);
container.register('serverConfig', [], serverConfig);
container.register('server', ['serverConfig', 'logger'], Server);

export default container;
