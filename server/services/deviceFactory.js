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
     * @param {string} brand - The brand of the device (e.g., 'Samsung', 'Apple').
     * @param {string} device - The type of the device (e.g., 'Smartwatch', 'Bracelet').
     * @param {string} id - The unique identifier for the device.
     * @param {Date} lastSeeded - Timestamp of the last seeding operation.
     * @returns {Device} - An instance of the specified device.
     * @throws {Error} - Throws an error if the brand or device type is unsupported.
     * @description Creates and returns an instance of a device based on the specified brand and device type.
     */
    createDevice(brand, device, id, lastSeeded) {
        const name = `${brand}-${device}`.toLowerCase();
        switch (brand) {
            case 'Samsung':
                switch (device) {
                    case 'Smartwatch':
                        return new SamsungWatch(this._config, this._logger, id, name, lastSeeded);
                    case 'Bracelet':
                        return new SamsungBracelet(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported device type for Samsung');
                }
            case 'Apple':
                switch (device) {
                    case 'Smartwatch':
                        return new AppleWatch(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported device type for Apple');
                }
            case 'Xiaomi':
                switch (device) {
                    case 'Smartwatch':
                        return new XiaomiWatch(this._config, this._logger, id, name, lastSeeded);
                    case 'Bracelet':
                        return new XiaomiBracelet(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported device type for Xiaomi');
                }
            case 'FitBit':
                switch (device) {
                    case 'Bracelet':
                        return new FitbitBracelet(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported device type for FitBit');
                }
            case 'Dreem':
                switch (device) {
                    case 'Headband':
                        return new DreemHeadband(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported device type for Dreem');
                }
            case 'Muse':
                switch (device) {
                    case 'Headband':
                        return new MuseHeadband(this._config, this._logger, id, name, lastSeeded);
                    default:
                        throw new Error('Unsupported device type for Muse');
                }
            default:
                throw new Error('Unsupported brand');
        }
    }
}
