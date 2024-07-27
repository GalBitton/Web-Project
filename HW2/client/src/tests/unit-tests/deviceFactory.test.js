// src/tests/deviceFactory.tests.js
import { DeviceFactory } from '../../services/deviceFactory.js';
import AppleWatch from '../../services/devices/apple.js';
import { SamsungWatch, SamsungBracelet } from '../../services/devices/samsung.js';
import { XiaomiWatch, XiaomiBracelet } from '../../services/devices/xiaomi.js';
import FitbitBracelet from '../../services/devices/fitbit.js';
import DreemHeadband from '../../services/devices/dreem.js';
import MuseHeadband from '../../services/devices/muse.js';

test('createDevice returns correct Apple device instance', () => {
    const device = DeviceFactory.createDevice('Apple', 'Smartwatch', {});
    expect(device).toBeInstanceOf(AppleWatch);
});

test('createDevice returns correct Samsung device instance for Smartwatch', () => {
    const device = DeviceFactory.createDevice('Samsung', 'Smartwatch', {});
    expect(device).toBeInstanceOf(SamsungWatch);
});

test('createDevice returns correct Samsung device instance for Bracelet', () => {
    const device = DeviceFactory.createDevice('Samsung', 'Bracelet', {});
    expect(device).toBeInstanceOf(SamsungBracelet);
});

test('createDevice throws error for unsupported device type', () => {
    expect(() => {
        DeviceFactory.createDevice('Apple', 'UnknownDevice', {});
    }).toThrow('Unsupported device type for Apple');
});

test('createDevice throws error for unsupported brand', () => {
    expect(() => {
        DeviceFactory.createDevice('UnknownBrand', 'Smartwatch', {});
    }).toThrow('Unsupported brand');
});
