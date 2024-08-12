import { calculateOverallAverage } from '../../utils/mathUtils.js';

describe('calculateOverallAverage', () => {

    /**
     * Tests that the function returns the correct average for a valid array of numbers.
     */
    test('returns correct overall average for valid numbers', () => {
        const data = [10, 20, 30, 40];
        const overallAverage = calculateOverallAverage(data);
        expect(overallAverage).toBe('25.00');
    });

    /**
     * Tests that the function correctly filters out non-numeric values from the array.
     */
    test('filters out non-number values', () => {
        const data = [10, '20', 30, null, undefined, NaN, 40];
        const overallAverage = calculateOverallAverage(data);
        expect(overallAverage).toBe('25.00');
    });

    /**
     * Tests that the function returns '0.00' for an empty array.
     */
    test('returns 0 for empty array', () => {
        const data = [];
        const overallAverage = calculateOverallAverage(data);
        expect(overallAverage).toBe('0.00');
    });

    /**
     * Tests that the function returns the correct average for an array with a single value.
     */
    test('returns correct average for single value array', () => {
        const data = [10];
        const overallAverage = calculateOverallAverage(data);
        expect(overallAverage).toBe('10.00');
    });

});
