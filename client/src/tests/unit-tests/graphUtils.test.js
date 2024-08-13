// src/tests/graphUtils.tests.js
/**
 * Tests for the getGraphSummary function.
 */
import { getGraphSummary } from '../../utils/graphUtils.js';

/**
 * Tests that getGraphSummary returns the correct summary for normal heart rate.
 */
test('getGraphSummary returns correct summary for heartRate', () => {
    const summary = getGraphSummary(65, 'heartRate');
    expect(summary).toBe('Your average heartbeat per minute is 65 BPM, which is normal.');
});

/**
 * Tests that getGraphSummary returns the correct summary for low heart rate.
 */
test('getGraphSummary returns correct summary for low heartRate', () => {
    const summary = getGraphSummary(55, 'heartRate');
    expect(summary).toBe('Your average heartbeat per minute is 55 BPM, which is low.');
});


/**
 * Tests that getGraphSummary returns the correct summary for high heart rate.
 */
test('getGraphSummary returns correct summary for high heartRate', () => {
    const summary = getGraphSummary(105, 'heartRate');
    expect(summary).toBe('Your average heartbeat per minute is 105 BPM, which is high.');
});

/**
 * Tests that getGraphSummary returns the correct summary for normal steps count.
 */
test('getGraphSummary returns correct summary for steps', () => {
    const summary = getGraphSummary(8000, 'steps');
    expect(summary).toBe('Your average steps count is 8000, which is normal.');
});

/**
 * Tests that getGraphSummary returns the correct summary for low steps count.
 */
test('getGraphSummary returns correct summary for low steps', () => {
    const summary = getGraphSummary(4000, 'steps');
    expect(summary).toBe('Your average steps count is 4000, which is low.');
});

/**
 * Tests that getGraphSummary returns the correct summary for high steps count.
 */
test('getGraphSummary returns correct summary for high steps', () => {
    const summary = getGraphSummary(12000, 'steps');
    expect(summary).toBe('Your average steps count is 12000, which is high.');
});

/**
 * Tests that getGraphSummary returns the correct summary for calories burned.
 */
test('getGraphSummary returns correct summary for calories', () => {
    const summary = getGraphSummary(2500, 'calories');
    expect(summary).toBe('Your average calories burned is 2500 kcal.');
});

/**
 * Tests that getGraphSummary returns the correct summary for sleep duration.
 */
test('getGraphSummary returns correct summary for sleep', () => {
    const summary = getGraphSummary(8, 'sleep');
    expect(summary).toBe('Your average sleep duration is 8 hours, which is within recommended range.');
});

/**
 * Tests that getGraphSummary returns the correct summary for low sleep duration.
 */
test('getGraphSummary returns correct summary for low sleep', () => {
    const summary = getGraphSummary(5, 'sleep');
    expect(summary).toBe('Your average sleep duration is 5 hours, which is less than recommended.');
});

/**
 * Tests that getGraphSummary returns "Unknown type" for an unknown type.
 */
test('getGraphSummary returns "Unknown type" for unknown type', () => {
    const summary = getGraphSummary(5, 'unknown');
    expect(summary).toBe('Unknown type');
});
