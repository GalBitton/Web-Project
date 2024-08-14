/**
 * Tests for data retrieval methods of various devices.
 *
 * The suite includes tests for the following devices:
 * - AppleWatch
 * - FitbitBracelet
 * - MuseHeadband
 * - DreemHeadband
 * - SamsungWatch
 * - SamsungBracelet
 * - XiaomiWatch
 * - XiaomiBracelet
 *
 * Each test verifies that the `getFieldValue` method of the device class correctly returns the expected data from a given input.
 *
 * @module deviceTests
 */
import container from '../../containerConfig.js';
import AppleWatch from '../../services/devices/apple.js';
import FitbitBracelet from '../../services/devices/fitbit.js';
import MuseHeadband from '../../services/devices/muse.js';
import DreemHeadband from '../../services/devices/dreem.js';
import { SamsungWatch, SamsungBracelet } from '../../services/devices/samsung.js';
import { XiaomiWatch, XiaomiBracelet } from '../../services/devices/xiaomi.js';

let config;
let logger;
let device;

beforeEach(() => {
    config = container.get('dataSeedingConfig');
    logger = {
        log: console.log,
        info: console.info,
        debug: console.debug,
        warn: console.warn,
        error: console.error
    };
});

describe('AppleWatch', () => {
    beforeEach(() => {
        device = new AppleWatch(config, logger, 0, 'Apple Watch', null);
    });

    /**
     * Verifies that `getFieldValue` returns the correct sleep data from AppleWatch.
     */
    test('getFieldValue returns correct sleep data', () => {
        const entry = {
            sleep: { duration: 480, quality: 'Good' }
        };
        const sleepData = device.getFieldValue(entry, 'sleep');
        expect(sleepData).toEqual({ duration: 480, quality: 'Good' });
    });
});

describe('FitbitBracelet', () => {
    beforeEach(() => {
        device = new FitbitBracelet(config, logger, 0, 'Fitbit Bracelet', null);
    });

    /**
     * Verifies that `getFieldValue` returns the correct stress data from FitbitBracelet.
     */
    test('getFieldValue returns correct stress data', () => {
        const entry = {
            stressManagement: { score: 8.0 }
        };
        const stressData = device.getFieldValue(entry, 'stress');
        expect(stressData).toEqual(10.0 - 8.0); // Adjust expected value based on logic
    });
});

describe('MuseHeadband', () => {
    beforeEach(() => {
        device = new MuseHeadband(config, logger, 0, 'Muse Headband', null);
    });

    /**
     * Verifies that `getFieldValue` returns the correct EEG data from MuseHeadband.
     */
    test('getFieldValue returns correct EEG data', () => {
        const entry = {
            EEG: { alphaWaves: 10, betaWaves: 20, gammaWaves: 30 }
        };
        const eegData = device.getFieldValue(entry, 'EEG');
        expect(eegData).toEqual({ alpha: 10, beta: 20, gamma: 30 });
    });
});

describe('DreemHeadband', () => {
    beforeEach(() => {
        device = new DreemHeadband(config, logger, 0, 'Dreem Headband', null);
    });

    /**
     * Verifies that `getFieldValue` returns the correct sleep data from DreemHeadband.
     */
    test('getFieldValue returns correct sleep data', () => {
        const entry = {
            sleepData: { totalDuration: 480, sleepQuality: 0.8567 }
        };
        const sleepData = device.getFieldValue(entry, 'sleep');
        expect(sleepData).toEqual({ duration: 480, quality: 'Good' }); // Adjust expected value based on logic
    });
});

describe('SamsungWatch', () => {
    beforeEach(() => {
        device = new SamsungWatch(config, logger, 0, 'Samsung Watch', null);
    });

    /**
     * Verifies that `getFieldValue` returns the correct heart rate data from SamsungWatch.
     */
    test('getFieldValue returns correct heartRate data', () => {
        const entry = {
            heartRate: 72
        };
        const heartRateData = device.getFieldValue(entry, 'heartRate');
        expect(heartRateData).toBe(72);
    });
});

describe('SamsungBracelet', () => {
    beforeEach(() => {
        device = new SamsungBracelet(config, logger, 0, 'Samsung Bracelet', null);
    });

    /**
     * Verifies that `getFieldValue` returns the correct stress data from SamsungBracelet.
     */
    test('getFieldValue returns correct stress data', () => {
        const entry = {
            stressLevel: 5
        };
        const stressData = device.getFieldValue(entry, 'stress');
        expect(stressData).toEqual(5);
    });
});

describe('XiaomiWatch', () => {
    beforeEach(() => {
        device = new XiaomiWatch(config, logger, 0, 'Xiaomi Watch', null);
    });

    /**
     * Verifies that `getFieldValue` returns the correct VO2Max data from XiaomiWatch.
     */
    test('getFieldValue returns correct VO2Max data', () => {
        const entry = {
            VO2Max: 45
        };
        const vo2MaxData = device.getFieldValue(entry, 'VO2Max');
        expect(vo2MaxData).toBe(45);
    });
});

describe('XiaomiBracelet', () => {
    beforeEach(() => {
        device = new XiaomiBracelet(config, logger, 0, 'Xiaomi Bracelet', null);
    });

    /**
     * Verifies that `getFieldValue` returns the correct sleep data from XiaomiBracelet.
     */
    test('getFieldValue returns correct sleep data', () => {
        const entry = {
            sleep: { totalDuration: 420, qualityIndex: 1.297 }
        };
        const sleepData = device.getFieldValue(entry, 'sleep');
        expect(sleepData).toEqual({ duration: 420, quality: 'Unknown' });
    });
});
