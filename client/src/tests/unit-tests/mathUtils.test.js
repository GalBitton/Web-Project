// src/tests/mathUtils.tests.js
import { calculateOverallAverage } from '../../utils/mathUtils.js';

test('calculateOverallAverage returns correct overall average for valid numbers', () => {
    const data = [10, 20, 30, 40];
    const overallAverage = calculateOverallAverage(data);
    expect(overallAverage).toBe('25.00');
});

test('calculateOverallAverage filters out non-number values', () => {
    const data = [10, '20', 30, null, undefined, NaN, 40];
    const overallAverage = calculateOverallAverage(data);
    expect(overallAverage).toBe('26.67');
});

test('calculateOverallAverage returns 0 for empty array', () => {
    const data = [];
    const overallAverage = calculateOverallAverage(data);
    expect(overallAverage).toBe('0.00');
});

test('calculateOverallAverage returns correct average for single value array', () => {
    const data = [10];
    const overallAverage = calculateOverallAverage(data);
    expect(overallAverage).toBe('10.00');
});
