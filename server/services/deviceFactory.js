import { SamsungWatch, SamsungBracelet } from "./devices/samsung.js";
import { XiaomiWatch, XiaomiBracelet } from "./devices/xiaomi.js";
import AppleWatch from "./devices/apple.js";
import FitbitBracelet from './devices/fitbit.js';
import DreemHeadband from './devices/dreem.js';
import MuseHeadband from './devices/muse.js';

/**
 * @class DeviceFactory
 * @description Factory class for creating device instances based on brand and type.
 */
export default class DeviceFactory {
    /**
     * @constructor
     * @param {Object} config - Configuration object for devices.
     * @param {Object} logger - Logger instance for logging operations.
     */
    constructor(config, logger) {
        this._config = config;
        this._logger = logger;
    }

    /**
     * @method createDevice
     * @param {string} brand - The brand of the type (e.g., 'Samsung', 'Apple').
     * @param {string} type - The type of the type (e.g., 'Smartwatch', 'Bracelet').
     * @param {string} id - The unique identifier for the type.
     * @param {Date} lastSeeded - Timestamp of the last seeding operation.
     * @returns {Device} - An instance of the specified type.
     * @throws {Error} - Throws an error if the brand or type is unsupported.
     * @description Creates and returns an instance of a type based on the specified brand and type.
     */
    createDevice(brand, type, id, lastSeeded) {
        const name = `${brand}`.toLowerCase() + type;
        switch (brand) {
            case 'Samsung':
                switch (type) {
                    case 'Smartwatch':
                        return new SamsungWatch(this._config, this._logger, id, name, lastSeeded);
                    case 'Bracelet':
                        return new SamsungBracelet(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported type type for Samsung');
                }
            case 'Apple':
                switch (type) {
                    case 'Smartwatch':
                        return new AppleWatch(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported type type for Apple');
                }
            case 'Xiaomi':
                switch (type) {
                    case 'Smartwatch':
                        return new XiaomiWatch(this._config, this._logger, id, name, lastSeeded);
                    case 'Bracelet':
                        return new XiaomiBracelet(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported type type for Xiaomi');
                }
            case 'FitBit':
                switch (type) {
                    case 'Bracelet':
                        return new FitbitBracelet(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported type type for FitBit');
                }
            case 'Dreem':
                switch (type) {
                    case 'Headband':
                        return new DreemHeadband(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported type type for Dreem');
                }
            case 'Muse':
                switch (type) {
                    case 'Headband':
                        return new MuseHeadband(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported type type for Muse');
                }
            default:
                throw new Error('Unsupported brand');
        }
    }
}
