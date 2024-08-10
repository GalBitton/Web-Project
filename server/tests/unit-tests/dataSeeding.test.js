import { jest } from '@jest/globals';
import container from '../../containerConfig.js';
import AppleWatch from '../../services/devices/apple.js';
import { translateSleepQualityToIndex } from "../../utils/sleepTranslation.js";

describe('AppleWatch', () => {
    let device;
    let config;
    let logger;

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

        // Set system time to daytime by default (e.g., 12:00 PM)
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-08-09T12:00:00Z')); // 12:00 PM
    });

    afterEach(() => {
        jest.useRealTimers(); // Reset timers after each test
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

    test('should generate data points for 3 days given lastSeeded value null', async () => {
        device = new AppleWatch(config, logger, 1, 'apple-smartwatch', null);
        await device.seedDatabase();

        const expectedPoints = 432;
        expect(device.data).toHaveLength(expectedPoints);
    });

    test('should generate data points with correct structure', async () => {
        jest.setSystemTime(new Date('2024-08-06T14:00:00Z')); // Set time to 2:00 PM on a Thursday
        await device.seedDatabase();
        const dataPoint = device.data[0];
        const fields = device.getFields();

        fields.forEach(field => {
            if (field === 'sleep') {
                return;
            }
            expect(dataPoint).toHaveProperty(field);
        });
    });

    test('should generate data points within specified value ranges with max deviation', async () => {
        jest.setSystemTime(new Date('2024-08-08T14:00:00Z')); // Set time to 2:00 PM on a Thursday

        await device.seedDatabase();
        const dataPoint = device.data[0];
        const ranges = config.valueRanges;
        const maxDeviations = config.commonFieldValueMaxDeviations;

        const adjustRange = (min, max, deviation) => {
            const lowerBound = min - deviation;
            const upperBound = max + deviation;
            return { lowerBound, upperBound };
        };

        const heartRateRange = adjustRange(ranges.heartRate.min, ranges.heartRate.max, maxDeviations.heartRate);
        expect(dataPoint.heartRate).toBeGreaterThanOrEqual(heartRateRange.lowerBound);
        expect(dataPoint.heartRate).toBeLessThanOrEqual(heartRateRange.upperBound);

        const stepsRange = adjustRange(ranges.steps.min, ranges.steps.max, maxDeviations.steps);
        expect(dataPoint.steps).toBeGreaterThanOrEqual(stepsRange.lowerBound);
        expect(dataPoint.steps).toBeLessThanOrEqual(stepsRange.upperBound);

        const caloriesBurnedRange = adjustRange(ranges.caloriesBurned.min, ranges.caloriesBurned.max, maxDeviations.caloriesBurned);
        expect(dataPoint.caloriesBurned).toBeGreaterThanOrEqual(caloriesBurnedRange.lowerBound);
        expect(dataPoint.caloriesBurned).toBeLessThanOrEqual(caloriesBurnedRange.upperBound);

        const systolicBPRange = adjustRange(ranges.bloodPressureSystolic.min, ranges.bloodPressureSystolic.max, maxDeviations.systolicBloodPressure || 0);
        expect(dataPoint.bloodPressure.systolic).toBeGreaterThanOrEqual(systolicBPRange.lowerBound);
        expect(dataPoint.bloodPressure.systolic).toBeLessThanOrEqual(systolicBPRange.upperBound);

        const diastolicBPRange = adjustRange(ranges.bloodPressureDiastolic.min, ranges.bloodPressureDiastolic.max, maxDeviations.diastolicBloodPressure || 0);
        expect(dataPoint.bloodPressure.diastolic).toBeGreaterThanOrEqual(diastolicBPRange.lowerBound);
        expect(dataPoint.bloodPressure.diastolic).toBeLessThanOrEqual(diastolicBPRange.upperBound);
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

    // New tests for sleep feature and exclusion cases
    describe('Sleep feature', () => {
        beforeEach(() => {
            // Set system time to nighttime for sleep-related tests (e.g., 11:00 PM)
            jest.setSystemTime(new Date('2024-08-09T23:00:00Z')); // 11:00 PM
        });

        test('should generate sleep data within specified ranges', async () => {
            await device.seedDatabase();
            const dataPoint = device.data[0];
            const ranges = config.valueRanges;

            expect(dataPoint.sleep.duration).toBeGreaterThanOrEqual(ranges.sleepDuration.min);
            expect(dataPoint.sleep.duration).toBeLessThanOrEqual(ranges.sleepDuration.max);
            expect(translateSleepQualityToIndex(dataPoint.sleep.quality)).toBeGreaterThanOrEqual(ranges.sleepQuality.min);
            expect(translateSleepQualityToIndex(dataPoint.sleep.quality)).toBeLessThanOrEqual(ranges.sleepQuality.max);
        });

        test('should include sleep field in generated data points during nighttime', async () => {
            await device.seedDatabase();
            const dataPoint = device.data[0];
            expect(dataPoint).toHaveProperty('sleep');
        });

        test('should include sleep field in generated data points during Friday afternoon nap', async () => {
            // Adjust to your local time by subtracting 3 hours to match 2:00 PM local time (GMT +3)
            jest.setSystemTime(new Date('2024-08-09T11:00:00Z')); // This sets the time to 2:00 PM local time (GMT +3)

            await device.seedDatabase();

            const dataPoint = device.data[0];
            expect(dataPoint).toHaveProperty('sleep');
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

        test('should exclude sleep field in generated data points during daytime', async () => {
            jest.setSystemTime(new Date('2024-08-09T16:00:00Z')); // Set time to 16:00 PM (daytime)

            await device.seedDatabase();
            const dataPoint = device.data[0];
            expect(dataPoint).not.toHaveProperty('sleep');
        });
    });
});
