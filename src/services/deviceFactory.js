import { SamsungWatch, SamsungBracelet } from "./devices/samsung.js";
import { XiaomiWatch, XiaomiBracelet } from "./devices/xiaomi.js";
import AppleWatch from "./devices/apple.js";
import FitbitBracelet from './devices/fitbit.js';
import DreemHeadband from './devices/dreem.js';
import MuseHeadband from './devices/muse.js';

export class DeviceFactory {
    static createDevice(brand, device, data) {
        switch (brand) {
            case 'Samsung':
                switch (device) {
                    case 'Smartwatch':
                        return new SamsungWatch(data);
                    case 'Bracelet':
                        return new SamsungBracelet(data);
                    default:
                        throw new Error('Unsupported device type for Samsung');
                }
            case 'Apple':
                switch (device) {
                    case 'Smartwatch':
                        return new AppleWatch(data);
                    default:
                        throw new Error('Unsupported device type for Apple');
                }
            case 'Xiaomi':
                switch (device) {
                    case 'Smartwatch':
                        return new XiaomiWatch(data);
                    case 'Bracelet':
                        return new XiaomiBracelet(data);
                    default:
                        throw new Error('Unsupported device type for Xiaomi');
                }
            case 'FitBit':
                switch (device) {
                    case 'Bracelet':
                        return new FitbitBracelet(data);
                    default:
                        throw new Error('Unsupported device type for FitBit');
                }
            case 'Dreem':
                switch (device) {
                    case 'Headband':
                        return new DreemHeadband(data);
                    default:
                        throw new Error('Unsupported device type for Dreem');
                }
            case 'Muse':
                switch (device) {
                    case 'Headband':
                        return new MuseHeadband(data);
                    default:
                        throw new Error('Unsupported device type for Muse');
                }
            default:
                throw new Error('Unsupported brand');
        }
    }
}
