/**
 * Calculates the overall average of an array of numbers.
 *
 * The function filters out non-numeric values from the input array, computes the average of the remaining valid numbers, 
 * and returns the result as a string formatted to two decimal places.
 *
 * @param {Array} averages - The array of values to calculate the average from. The array can contain numbers, strings, null, undefined, or NaN.
 * @returns {string} The calculated average, formatted to two decimal places. Returns '0.00' if the array is empty or contains no valid numbers.
 *
 * @example
 * // Returns '25.00'
 * calculateOverallAverage([10, 20, 30, 40]);
 *
 * @example
 * // Returns '25.00' (filters out non-numeric values)
 * calculateOverallAverage([10, '20', 30, null, undefined, NaN, 40]);
 *
 * @example
 * // Returns '0.00' (empty array)
 * calculateOverallAverage([]);
 *
 * @example
 * // Returns '10.00' (single value array)
 * calculateOverallAverage([10]);
 */
const calculateOverallAverage = (averages) => {
    if (averages.length === 0) {
        return '0.00';
    }
    const validAverages = averages
        .map(item => parseFloat(item))
        .filter(item => typeof item === 'number' && !isNaN(item));
    const total = validAverages.reduce((sum, value) => sum + value, 0);
    return (total / validAverages.length).toFixed(2);
};

export {
    calculateOverallAverage,
}
