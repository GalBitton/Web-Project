import { jest } from '@jest/globals';
import container from '../../containerConfig.js';
import AppleWatch from '../../services/devices/apple.js';

describe('AppleWatch', () => {
    let device;
    let config;
    let logger;

    const translateSleepQuality = (quality) => {
        switch (quality) {
            case "Very Poor":
                return 0.3;
            case "Poor":
                return 0.6;
            case "Fair":
                return 0.8;
            case "Good":
                return 0.9;
            case "Excellent":
                return 1.0;
            default:
                return "Unknown";
        }
    }

    beforeEach(() => {
        config = container.get('dataSeedingConfig');
        logger = {
            log: console.log,
            info: console.info,
            debug: console.debug,
            warn: console.warn,
            error: console.error
        };
        device = new AppleWatch(config, logger, 1, 'apple-smartwatch', null);
    });

    test('should generate the correct number of data points', async () => {
        await device.seedDatabase();
        expect(device.data).toHaveLength(config.points);
    });

    test('should generate 2 data points given lastSeeded value 20 minutes ago', async () => {
        const now = new Date();
        const difference = now.getMinutes() - 2 * config.timeWindowMinutes / config.points; // 20 Intervals ago (20 minutes ago)
        const lastSeeded = now.setMinutes(difference);
        device = new AppleWatch(config, logger, 1, 'apple-smartwatch', lastSeeded);
        await device.seedDatabase();

        const expectedPoints = 2;
        expect(device.data).toHaveLength(expectedPoints);
    });

    test('should generate 2 data points given lastSeeded value 28 minutes ago', async () => {
        const now = new Date();
        const difference = now.getMinutes() - 28; // 28 minutes ago
        const lastSeeded = now.setMinutes(difference);
        device = new AppleWatch(config, logger, 1, 'apple-smartwatch', lastSeeded);
        await device.seedDatabase();

        const expectedPoints = 2;
        expect(device.data).toHaveLength(expectedPoints);
    });

    test('should generate 0 data points given lastSeeded value 8 minutes ago', async () => {
        const now = new Date();
        const difference = now.getMinutes() - 8; // 8 minutes ago
        const lastSeeded = now.setMinutes(difference);
        device = new AppleWatch(config, logger, 1, 'apple-smartwatch', lastSeeded);
        await device.seedDatabase();

        const expectedPoints = 0;
        expect(device.data).toHaveLength(expectedPoints);
    });

    test('should generate data points with correct structure', async () => {
        await device.seedDatabase();
        const dataPoint = device.data[0];
        const fields = device.getFields();

        fields.forEach(field => {
            expect(dataPoint).toHaveProperty(field);
        });
    });

    test('should generate data points within specified value ranges', async () => {
        await device.seedDatabase();
        const dataPoint = device.data[0];
        const ranges = config.valueRanges;

        expect(dataPoint.heartRate).toBeGreaterThanOrEqual(ranges.heartRate.min);
        expect(dataPoint.heartRate).toBeLessThanOrEqual(ranges.heartRate.max);

        expect(dataPoint.steps).toBeGreaterThanOrEqual(ranges.steps.min);
        expect(dataPoint.steps).toBeLessThanOrEqual(ranges.steps.max);

        expect(dataPoint.caloriesBurned).toBeGreaterThanOrEqual(ranges.caloriesBurned.min);
        expect(dataPoint.caloriesBurned).toBeLessThanOrEqual(ranges.caloriesBurned.max);

        expect(dataPoint.sleep.duration).toBeGreaterThanOrEqual(ranges.sleepDuration.min);
        expect(dataPoint.sleep.duration).toBeLessThanOrEqual(ranges.sleepDuration.max);

        expect(dataPoint.bloodPressure.systolic).toBeGreaterThanOrEqual(ranges.bloodPressureSystolic.min);
        expect(dataPoint.bloodPressure.systolic).toBeLessThanOrEqual(ranges.bloodPressureSystolic.max);

        expect(dataPoint.bloodPressure.diastolic).toBeGreaterThanOrEqual(ranges.bloodPressureDiastolic.min);
        expect(dataPoint.bloodPressure.diastolic).toBeLessThanOrEqual(ranges.bloodPressureDiastolic.max);
    });

    test('should precompute random values correctly', () => {
        device.precomputeRandomValues(device.getFields(), config.points);
        const fields = device.getFields();

        fields.forEach(field => {
            expect(device.randomCache[field]).toHaveLength(config.points);
        });
    });

    test('should generate data in batches', async () => {
        const batchSize = config.batchSize || 10;
        const generateDataBatchSpy = jest.spyOn(device, 'generateDataBatch');

        await device.seedDatabase();

        const expectedBatches = Math.ceil(config.points / batchSize);
        expect(generateDataBatchSpy).toHaveBeenCalledTimes(expectedBatches);
    });

    // New tests for sleep mapping
    test('should generate sleep data within specified ranges', async () => {
        await device.seedDatabase();
        const dataPoint = device.data[0];
        const ranges = config.valueRanges;

        expect(dataPoint.sleep.duration).toBeGreaterThanOrEqual(ranges.sleepDuration.min);
        expect(dataPoint.sleep.duration).toBeLessThanOrEqual(ranges.sleepDuration.max);
        expect(translateSleepQuality(dataPoint.sleep.quality)).toBeGreaterThanOrEqual(ranges.sleepQuality.min);
        expect(translateSleepQuality(dataPoint.sleep.quality)).toBeLessThanOrEqual(ranges.sleepQuality.max);
    });

    test('should include sleep field in generated data points', async () => {
        await device.seedDatabase();
        const dataPoint = device.data[0];
        expect(dataPoint).toHaveProperty('sleep');
        expect(dataPoint.sleep).toHaveProperty('duration');
        expect(dataPoint.sleep).toHaveProperty('quality');
    });

    test('should correctly map sleep field values', () => {
        const entry = {
            sleep: {
                duration: 6,
                quality: 0.8
            }
        };
        const sleepValue = device.getFieldValue(entry, 'sleep');
        expect(sleepValue).toEqual({
            duration: 6,
            quality: 0.8
        });
    });
});
