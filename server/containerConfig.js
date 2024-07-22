// IoC Container
'use strict';

import container from 'kontainer-di';
import serviceData from './package.json' assert { type: "json" };
import config from 'config';
import logger from './logger.js';
import Server from './server.js';

const serverConfig = config.get("server");
const loggerConfig = config.get("logger");
const authConfig = config.get("auth");

container.register('serviceData', [], serviceData);
container.register('serviceName', [], serviceData.name);
container.register('authConfig', [], authConfig);
container.register('loggerConfig', [], loggerConfig);
container.register('logger', ['loggerConfig'], logger);
container.register('serverConfig', [], serverConfig);
container.register('server', ['serverConfig', 'logger'], Server);

export default container;