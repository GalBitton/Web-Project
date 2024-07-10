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
                if (device == 'Smartwatch') {
                    return new SamsungWatch(data);
                }
                return new SamsungBracelet(data);
            case 'Apple':
                if (device == 'Smartwatch') {
                    return new AppleWatch(data);
                }
            case 'Xiaomi':
                if (device == 'Smartwatch') {
                    return new XiaomiWatch(data);
                }
                return new XiaomiBracelet(data);
            case 'FitBit':
                if (device === 'Bracelet') {
                    return new FitbitBracelet(data);
                }
            case 'Dreem':
                if (device == 'Headband') {
                    return new DreemHeadband(data);
                }
            case 'Muse':
                if (device == 'Headband') {
                    return new MuseHeadband(data);
                }
            default:
                throw new Error('Unsupported device type');
        }
    }
}
