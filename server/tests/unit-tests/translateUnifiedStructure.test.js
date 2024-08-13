import DeviceFactory from "../../services/deviceFactory.js";
import UnifiedStructureConverter from "../../services/unifiedStructureConverter.js";

// Sample device data for testing
const sampleAppleWatchData = [{
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
}];

const sampleFitbitData = [{
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
}];

const sampleSamsungData = [{
    heartRate: 70,
    steps: 9000,
    caloriesBurned: 320,
    sleep: {
        durationHours: 8,
        qualityRating: 0.8
    },
    stressLevel: 4,
    breathingRate: 16
}];

// Mock device class instance
const deviceFactory = new DeviceFactory({}, console.log);
const mockApple = deviceFactory.createDevice("Apple", "Smartwatch", 1,null);
const mockFitbit = deviceFactory.createDevice("FitBit", "Bracelet", 1,null);
const mockSamsungBracelet = deviceFactory.createDevice("Samsung", "Bracelet", 1,null);
const mockUnifiedConverter = new UnifiedStructureConverter();

describe('Device Class', () => {
    describe('translateToUnifiedStructure', () => {
        test('should translate Apple Watch data to unified structure correctly', () => {
            const result = mockApple.extractGraphData(sampleAppleWatchData, 'appleSmartwatch');
            expect(result).toEqual({
                heartRate: 72,
                steps: 8000,
                caloriesBurned: 300,
                sleep: {
                    duration: 7.2,
                    quality: "Good"
                },
                stress: {
                    score: 0, // AppleWatch does not have stress data
                    breathingRate: 0
                },
                activity: {
                    move: 400,
                    exercise: 30,
                    stand: 10
                },
                bloodPressure: {
                    systolic: 120,
                    diastolic: 80
                },
                oxygenSaturation: 0,
                eeg: {
                    alpha: 0,
                    beta: 0,
                    gamma: 0,
                    delta: 0,
                    theta: 0
                },
                vo2Max: 0,
                focusScore: 0,
                respiratoryRate: 0
            });
        });

        test('should translate Fitbit data to unified structure correctly', () => {
            const result = mockApple.extractGraphData(sampleFitbitData, 'fitbitBracelet');
            expect(result).toEqual({
                heartRate: 75,
                steps: 10000,
                caloriesBurned: 350,
                sleep: {
                    duration: 6.5,
                    quality: "Fair"
                },
                stress: {
                    score: 5,
                    breathingRate: 15
                },
                activity: {
                    move: 0,
                    exercise: 0,
                    stand: 0
                },
                bloodPressure: {
                    systolic: 0,
                    diastolic: 0
                },
                oxygenSaturation: 0,
                eeg: {
                    alpha: 0,
                    beta: 0,
                    gamma: 0,
                    delta: 0,
                    theta: 0
                },
                vo2Max: 0,
                focusScore: 0,
                respiratoryRate: 0
            });
        });

        test('should translate Samsung Bracelet data to unified structure correctly', () => {
            const result = mockApple.extractGraphData(sampleSamsungData, 'samsungBracelet');
            expect(result).toEqual({
                heartRate: 70,
                steps: 9000,
                caloriesBurned: 320,
                sleep: {
                    duration: 8,
                    quality: 0.8 // Assuming qualityRating maps directly to quality
                },
                stress: {
                    score: 4,
                    breathingRate: 16
                },
                activity: {
                    move: 0,
                    exercise: 0,
                    stand: 0
                },
                bloodPressure: {
                    systolic: 0,
                    diastolic: 0
                },
                oxygenSaturation: 0,
                eeg: {
                    alpha: 0,
                    beta: 0,
                    gamma: 0,
                    delta: 0,
                    theta: 0
                },
                vo2Max: 0,
                focusScore: 0,
                respiratoryRate: 0
            });
        });
    });

    describe('getNestedField and setNestedField', () => {
        test('should retrieve a nested field correctly', () => {
            const data = { a: { b: { c: 10 } } };
            const result = mockUnifiedConverter.getNestedField(data, 'a.b.c');
            expect(result).toBe(10);
        });

        test('should return 0 if a nested field does not exist', () => {
            const data = { a: { b: { c: 10 } } };
            const result = mockUnifiedConverter.getNestedField(data, 'a.b.d');
            expect(result).toBe(0);
        });

        test('should set a nested field correctly', () => {
            const data = {};
            mockUnifiedConverter.setNestedField(data, 'a.b.c', 10);
            expect(data).toEqual({ a: { b: { c: 10 } } });
        });
    });

    describe('extractGraphData', () => {
        const sampleDatapoints = [
            {
                timestamp: "2024-08-08T19:43:35.307Z",
                data: sampleAppleWatchData
            },
            {
                timestamp: "2024-08-08T19:33:35.307Z",
                data: sampleFitbitData
            },
            {
                timestamp: "2024-08-08T19:23:35.307Z",
                data: sampleSamsungData
            }
        ];

        test('should correctly process heartRate data', () => {
            const processedData = mockApple.extractGraphData(sampleDatapoints);
            expect(processedData.heartRate.values[0]).toEqual(72);
        });

        test('should correctly process steps data', () => {
            const processedData = mockFitbit.extractGraphData(sampleDatapoints);
            expect(processedData.steps.values[0]).toEqual(10000);
        });

        test('should correctly process sleep duration data', () => {
            const processedData = mockSamsungBracelet.extractGraphData(sampleDatapoints);
            expect(processedData['sleep.duration'].values[0]).toEqual(8);
        });

        test('should handle missing data gracefully', () => {
            const processedData = mockApple.extractGraphData(sampleDatapoints);
            expect(processedData.vo2Max.labels).toEqual([]);
            expect(processedData.vo2Max.values).toEqual([]);
        });
    });
});
