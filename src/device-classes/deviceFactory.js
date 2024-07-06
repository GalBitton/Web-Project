import { SamsungWatch, SamsungBracelet } from "./samsung.js";
import { XiaomiWatch, XiaomiBracelet } from "./xiaomi.js";
import AppleWatch from "./apple.js";
import FitbitBracelet from './fitbit.js';
import DreemHeadband from './dreem.js';
import MuseHeadband from './muse.js';

export class DeviceFactory {
    static createDevice(brand, device, data) {
        switch (brand) {
            case 'Samsung':
                if (device == 'Smartwatch') {
                    return new SamsungWatch(data);
                }
                return new SamsungBracelet(data);
            case 'AppleWatch':
                return new AppleWatch(data);
            case 'Xiaomi':
                if (device == 'Smartwatch') {
                    return new XiaomiWatch(data);
                }
                return new XiaomiBracelet(data);
            case 'FitbitBracelet':
                return new FitbitBracelet(data);
            case 'DreemHeadband':
                return new DreemHeadband(data);
            case 'MuseHeadband':
                return new MuseHeadband(data);
            default:
                throw new Error('Unsupported device type');
        }
    }
}
