// IoC Container
'use strict';

import container from 'kontainer-di';
import serviceData from './package.json';
import config from 'config';
import logger from './logger';
import Server from './index';

const serverConfig = config.get("server");
const loggerConfig = config.get("logger");

container.register('serviceData', [], serviceData);
container.register('serviceName', [], serviceData.name);
container.register('loggerConfig', [], loggerConfig);
container.register('logger', ['loggerConfig'], logger);
container.register('serverConfig', [], serverConfig);
container.register('server', ['serverConfig', 'logger'], Server);