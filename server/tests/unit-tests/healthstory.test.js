/**
 * @fileoverview Tests for the HealthStory class, focusing on generating and analyzing health stories.
 */
import HealthStory from '../../services/healthStory.js';

describe('HealthStory', () => {

    /**
     * Test case for generating a story with all health stats provided.
     * It verifies that the story includes information on all provided health stats.
     */
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
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/heart rate/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/step count/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/sleep/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/stress/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/breathing/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/blood pressure/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/activity level/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/focus/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/EEG Analysis/)]));
    });

    /**
     * Test case for handling missing optional health stats gracefully.
     * It verifies that the story excludes information on missing stats.
     */
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
        // Phrases that should be present in the story
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/heart rate/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/sleep/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/stress/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/breathing/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/activity level/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/focus/)]));
        expect(story).toEqual(expect.arrayContaining([expect.stringMatching(/EEG Analysis/)]));

        // Phrases that should not be present in the story
        expect(story).toEqual(expect.not.arrayContaining([expect.stringMatching(/step count/)]));
        expect(story).toEqual(expect.not.arrayContaining([expect.stringMatching(/blood pressure/)]));

    });

    /**
     * Test case for analyzing EEG data.
     * It verifies that the EEG analysis includes accurate descriptions based on given data.
     */
    test('should analyze EEG correctly based on given data', () => {
        const healthStats = {
            eeg: {
                alpha: 0.65,
                beta: 0.75,
                gamma: 0.85,
                delta: 0.35,
                theta: 0.4,
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

    /**
     * Test case for handling all missing EEG data gracefully.
     * It verifies that the EEG analysis handles null data appropriately.
     */
    test('should handle all missing EEG data gracefully', () => {
        const healthStats = {
            eeg: null
        };

        const healthStory = new HealthStory(healthStats);
        const eegAnalysis = healthStory.analyzeEEG();
        expect(eegAnalysis).toBeNull();
    });
});
