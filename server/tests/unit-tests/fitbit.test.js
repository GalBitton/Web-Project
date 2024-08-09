import container from '../../containerConfig.js';
import FitbitBracelet from '../../services/devices/fitbit.js';

describe('FitbitBracelet', () => {
    let device;
    let config;

    beforeEach(() => {
        config = container.resolve('dataSeedingConfig');
        device = new FitbitBracelet(1);
    });

    test('should generate the correct number of data points', async () => {
        await device.seedDatabase();
        expect(device.data).toHaveLength(config.points);
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

        expect(dataPoint.stressManagement.score).toBeGreaterThanOrEqual(ranges.stressScore.min);
        expect(dataPoint.stressManagement.score).toBeLessThanOrEqual(ranges.stressScore.max);

        expect(dataPoint.stressManagement.breathingRate).toBeGreaterThanOrEqual(ranges.breathingRate.min);
        expect(dataPoint.stressManagement.breathingRate).toBeLessThanOrEqual(ranges.breathingRate.max);
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
});
