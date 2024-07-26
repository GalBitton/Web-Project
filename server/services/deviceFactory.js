import { SamsungWatch, SamsungBracelet } from "./devices/samsung.js";
import { XiaomiWatch, XiaomiBracelet } from "./devices/xiaomi.js";
import AppleWatch from "./devices/apple.js";
import FitbitBracelet from './devices/fitbit.js';
import DreemHeadband from './devices/dreem.js';
import MuseHeadband from './devices/muse.js';

export class DeviceFactory {
    static createDevice(brand, device, id) {
        switch (brand) {
            case 'Samsung':
                switch (device) {
                    case 'Smartwatch':
                        return new SamsungWatch(id);
                    case 'Bracelet':
                        return new SamsungBracelet(id);
                    default:
                        throw new Error('Unsupported device type for Samsung');
                }
            case 'Apple':
                switch (device) {
                    case 'Smartwatch':
                        return new AppleWatch(id);
                    default:
                        throw new Error('Unsupported device type for Apple');
                }
            case 'Xiaomi':
                switch (device) {
                    case 'Smartwatch':
                        return new XiaomiWatch(id);
                    case 'Bracelet':
                        return new XiaomiBracelet(id);
                    default:
                        throw new Error('Unsupported device type for Xiaomi');
                }
            case 'FitBit':
                switch (device) {
                    case 'Bracelet':
                        return new FitbitBracelet(id);
                    default:
                        throw new Error('Unsupported device type for FitBit');
                }
            case 'Dreem':
                switch (device) {
                    case 'Headband':
                        return new DreemHeadband(id);
                    default:
                        throw new Error('Unsupported device type for Dreem');
                }
            case 'Muse':
                switch (device) {
                    case 'Headband':
                        return new MuseHeadband(id);
                    default:
                        throw new Error('Unsupported device type for Muse');
                }
            default:
                throw new Error('Unsupported brand');
        }
    }
}
