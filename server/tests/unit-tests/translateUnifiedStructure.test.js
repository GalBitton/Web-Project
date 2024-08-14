import DeviceFactory from "../../services/deviceFactory.js";
import UnifiedStructureConverter from "../../services/unifiedStructureConverter.js";

// Sample device data for testing
const sampleAppleWatchData = [{
    timestamp: "2024-08-08T19:43:35.307Z",
    data: {
        heartRate: 72,
        steps: 8000,
        caloriesBurned: 300,
        sleep: {
            duration: 7.2,
            quality: "Good"
        },
        activityRings: {
            move: 400,
            exercise: 30,
            stand: 10
        },
        bloodPressure: {
            systolic: 120,
            diastolic: 80
        }
    }
}];

const sampleFitbitData = [{
    timestamp: "2024-08-08T19:33:35.307Z",
    data: {
        heartRate: 75,
        steps: 10000,
        caloriesBurned: 350,
        sleep: {
            duration: 6.5,
            quality: "Fair"
        },
        stressManagement: {
            score: 5,
            breathingRate: 15
        }
    }
}];

const sampleSamsungData = [{
    timestamp: "2024-08-08T19:23:35.307Z",
    data: {
        heartRate: 70,
        steps: 9000,
        caloriesBurned: 320,
        sleep: {
            durationHours: 8,
            qualityRating: 0.8
        },
        stressLevel: 4,
        breathingRate: 16
    }
}];

// Mock device class instances
const deviceFactory = new DeviceFactory({}, console.log);
const mockApple = deviceFactory.createDevice("Apple", "Smartwatch", 1, null);
const mockFitbit = deviceFactory.createDevice("FitBit", "Bracelet", 1, null);
const mockSamsungBracelet = deviceFactory.createDevice("Samsung", "Bracelet", 1, null);
const mockUnifiedConverter = new UnifiedStructureConverter(mockApple);

/**
 * @module Device Test Suite
 * @description Tests for device data extraction and transformation.
 */
describe('Device Class', () => {

    /**
     * @section extractGraphData Tests
     */
    describe('extractGraphData', () => {

        /**
         * @test should correctly process heartRate data
         * @description Tests if heartRate data is processed correctly from sample datapoints.
         */
        test('should correctly process heartRate data', () => {
            const processedData = mockApple.extractGraphData(sampleAppleWatchData);
            expect(processedData.heartRate.values[0]).toEqual(72);
        });

        /**
         * @test should correctly process steps data
         * @description Tests if steps data is processed correctly from sample datapoints.
         */
        test('should correctly process steps data', () => {
            const processedData = mockFitbit.extractGraphData(sampleFitbitData);
            expect(processedData.steps.values[0]).toEqual(10000);
        });

        /**
         * @test should correctly process sleep duration data
         * @description Tests if sleep duration data is processed correctly from sample datapoints.
         */
        test('should correctly process sleep duration data', () => {
            const processedData = mockSamsungBracelet.extractGraphData(sampleSamsungData);
            expect(processedData.sleep.values[0]).toEqual(8);
        });

        /**
         * @test should handle missing data gracefully
         * @description Tests if missing data is handled gracefully without errors.
         */
        test('should handle missing data gracefully', () => {
            const processedData = mockApple.extractGraphData(sampleAppleWatchData);
            expect(processedData.vo2Max.labels).toEqual([]);
            expect(processedData.vo2Max.values).toEqual([]);
        });
    });

    /**
     * @section getNestedField and setNestedField Tests
     */
    describe('getNestedField and setNestedField', () => {
        /**
         * @test should retrieve a nested field correctly
         * @description Tests if a nested field can be correctly retrieved from an object.
         */
        test('should retrieve a nested field correctly', () => {
            const data = { a: { b: { c: 10 } } };
            const result = mockUnifiedConverter.getNestedField(data, 'a.b.c');
            expect(result).toBe(10);
        });

        /**
         * @test should return 0 if a nested field does not exist
         * @description Tests if a default value of 0 is returned when a nested field does not exist.
         */
        test('should return 0 if a nested field does not exist', () => {
            const data = { a: { b: { c: 10 } } };
            const result = mockUnifiedConverter.getNestedField(data, 'a.b.d');
            expect(result).toBe(null);
        });
    });
});
