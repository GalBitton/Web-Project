import { SamsungWatch, SamsungBracelet } from "./devices/samsung.js";
import { XiaomiWatch, XiaomiBracelet } from "./devices/xiaomi.js";
import AppleWatch from "./devices/apple.js";
import FitbitBracelet from './devices/fitbit.js';
import DreemHeadband from './devices/dreem.js';
import MuseHeadband from './devices/muse.js';

export default class DeviceFactory {
    constructor(config, logger) {
        this._config = config;
        this._logger = logger;
    }

    createDevice(brand, device, id) {
        switch (brand) {
            case 'Samsung':
                switch (device) {
                    case 'Smartwatch':
                        return new SamsungWatch(this._config, this._logger, id);
                    case 'Bracelet':
                        return new SamsungBracelet(this._config, this._logger, id);
                    default:
                        throw new Error('Unsupported device type for Samsung');
                }
            case 'Apple':
                switch (device) {
                    case 'Smartwatch':
                        return new AppleWatch(this._config, this._logger, id);
                    default:
                        throw new Error('Unsupported device type for Apple');
                }
            case 'Xiaomi':
                switch (device) {
                    case 'Smartwatch':
                        return new XiaomiWatch(this._config, this._logger, id);
                    case 'Bracelet':
                        return new XiaomiBracelet(this._config, this._logger, id);
                    default:
                        throw new Error('Unsupported device type for Xiaomi');
                }
            case 'FitBit':
                switch (device) {
                    case 'Bracelet':
                        return new FitbitBracelet(this._config, this._logger, id);
                    default:
                        throw new Error('Unsupported device type for FitBit');
                }
            case 'Dreem':
                switch (device) {
                    case 'Headband':
                        return new DreemHeadband(this._config, this._logger, id);
                    default:
                        throw new Error('Unsupported device type for Dreem');
                }
            case 'Muse':
                switch (device) {
                    case 'Headband':
                        return new MuseHeadband(this._config, this._logger, id);
                    default:
                        throw new Error('Unsupported device type for Muse');
                }
            default:
                throw new Error('Unsupported brand');
        }
    }
}
