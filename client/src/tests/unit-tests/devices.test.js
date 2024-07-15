// src/tests/devices.tests.js
import AppleWatch from '../../services/devices/apple.js';
import FitbitBracelet from '../../services/devices/fitbit.js';
import MuseHeadband from '../../services/devices/muse.js';
import DreemHeadband from '../../services/devices/dreem.js';
import { SamsungWatch, SamsungBracelet } from '../../services/devices/samsung.js';
import { XiaomiWatch, XiaomiBracelet } from '../../services/devices/xiaomi.js';

test('AppleWatch getFieldValue returns correct sleep data', () => {
    const device = new AppleWatch();
    const entry = {
        sleep: { duration: 480, quality: 'Good' }
    };
    const sleepData = device.getFieldValue(entry, 'sleep');
    expect(sleepData).toEqual({ duration: 480, quality: 'Good' });
});

test('FitbitBracelet getFieldValue returns correct stress data', () => {
    const device = new FitbitBracelet();
    const entry = {
        stressManagement: { score: 2.0 }
    };
    const stressData = device.getFieldValue(entry, 'stress');
    expect(stressData).toEqual({ score: 8.0 });
});

test('MuseHeadband getFieldValue returns correct EEG data', () => {
    const device = new MuseHeadband();
    const entry = {
        EEG: { alphaWaves: 10, betaWaves: 20, gammaWaves: 30 }
    };
    const eegData = device.getFieldValue(entry, 'EEG');
    expect(eegData).toEqual({ alpha: 10, beta: 20, gamma: 30 });
});

test('DreemHeadband getFieldValue returns correct sleep data', () => {
    const device = new DreemHeadband();
    const entry = {
        sleepData: { totalDuration: 480, sleepQuality: 0.8567 }
    };
    const sleepData = device.getFieldValue(entry, 'sleep');
    expect(sleepData).toEqual({ duration: 480, quality: 'Good' });
});

test('SamsungWatch getFieldValue returns correct heartRate data', () => {
    const device = new SamsungWatch();
    const entry = {
        heartRate: 72
    };
    const heartRateData = device.getFieldValue(entry, 'heartRate');
    expect(heartRateData).toBe(72);
});

test('SamsungBracelet getFieldValue returns correct stress data', () => {
    const device = new SamsungBracelet();
    const entry = {
        stressLevel: 5
    };
    const stressData = device.getFieldValue(entry, 'stress');
    expect(stressData).toEqual({ score: 5 });
});

test('XiaomiWatch getFieldValue returns correct VO2Max data', () => {
    const device = new XiaomiWatch();
    const entry = {
        VO2Max: 45
    };
    const vo2MaxData = device.getFieldValue(entry, 'VO2Max');
    expect(vo2MaxData).toBe(45);
});

test('XiaomiBracelet getFieldValue returns correct sleep data', () => {
    const device = new XiaomiBracelet();
    const entry = {
        sleep: { totalDuration: 420, qualityIndex: 1.297 }
    };
    const sleepData = device.getFieldValue(entry, 'sleep');
    expect(sleepData).toEqual({ duration: 420, quality: 'Excellent' });
});
