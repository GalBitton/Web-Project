import HealthStory from '../../services/healthStory.js';

describe('HealthStory', () => {

    test('should generate a story with all health stats provided', () => {
        const healthStats = {
            heartRate: 85,
            steps: 12000,
            caloriesBurned: 300,
            sleep: {
                duration: 7,
                quality: "Fair",
            },
            stressScore: 5,
            breathingRate: 18,
            bloodPressure: {
                systolic: 120,
                diastolic: 80,
            },
            activityLevel: 60,
            focusScore: 80,
            eeg: {
                alpha: 0.65,
                beta: 0.75,
                gamma: 0.85,
                delta: 0.35,
                theta: 0.5,
            }
        };

        const healthStory = new HealthStory(healthStats);
        const story = healthStory.createStory();
        expect(story).toContain('heart rate');
        expect(story).toContain('step count');
        expect(story).toContain('sleep');
        expect(story).toContain('stress');
        expect(story).toContain('breathing');
        expect(story).toContain('blood pressure');
        expect(story).toContain('activity level');
        expect(story).toContain('focus');
        expect(story).toContain('EEG Analysis');
    });

    test('should handle missing optional health stats gracefully', () => {
        const healthStats = {
            heartRate: 85,
            steps: null, // Missing steps
            caloriesBurned: 300,
            sleep: null,
            stressScore: 5,
            breathingRate: 18,
            bloodPressure: null,
            activityLevel: 60,
            focusScore: 80,
            eeg: {
                alpha: null, // Missing EEG Alpha
                beta: 0.75,
                gamma: null, // Missing EEG Gamma
                delta: 0.35,
                theta: 0.5,
            }
        };

        const healthStory = new HealthStory(healthStats);
        const story = healthStory.createStory();
        expect(story).toContain('heart rate');
        expect(story).not.toContain('step count'); // Steps missing, should not appear
        expect(story).toContain('sleep');
        expect(story).toContain('stress');
        expect(story).toContain('breathing');
        expect(story).not.toContain('blood pressure'); // BP missing, should not appear
        expect(story).toContain('activity level');
        expect(story).toContain('focus');
        expect(story).toContain('EEG Analysis');
    });

    test('should analyze EEG correctly based on given data', () => {
        const healthStats = {
            eeg: {
                alpha: 0.65,
                beta: 0.75,
                gamma: 0.85,
                delta: 0.35,
                theta: 0.5,
            }
        };

        const healthStory = new HealthStory(healthStats);
        const eegAnalysis = healthStory.analyzeEEG();
        expect(eegAnalysis).toContain('strong alpha waves');
        expect(eegAnalysis).toContain('Elevated beta waves');
        expect(eegAnalysis).toContain('High gamma wave activity');
        expect(eegAnalysis).toContain('delta wave activity is low');
        expect(eegAnalysis).toContain('theta wave activity is low');
    });

    test('should handle all missing EEG data gracefully', () => {
        const healthStats = {
            eeg: null
        };

        const healthStory = new HealthStory(healthStats);
        const eegAnalysis = healthStory.analyzeEEG();
        expect(eegAnalysis).toBeNull();
    });
});
