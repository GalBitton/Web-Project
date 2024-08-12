/**
 * Converts a sleep quality string to a corresponding numerical index.
 *
 * The function maps sleep quality descriptions to numerical values ranging from 0.3 to 1.0, 
 * with each quality level representing a specific range.
 *
 * @param {string} quality - The description of sleep quality. Valid values are:
 *   - "Very Poor"
 *   - "Poor"
 *   - "Fair"
 *   - "Good"
 *   - "Excellent"
 * @returns {number|string} The corresponding numerical index for the given sleep quality. 
 *   Returns "Unknown" if the input is not a recognized quality description.
 *
 * @example
 * // Returns 0.9
 * translateSleepQualityToIndex("Good");
 *
 * @example
 * // Returns "Unknown"
 * translateSleepQualityToIndex("Average");
 */
const translateSleepQualityToIndex = (quality) => {
    switch (quality) {
        case "Very Poor":
            return 0.3;
        case "Poor":
            return 0.6;
        case "Fair":
            return 0.8;
        case "Good":
            return 0.9;
        case "Excellent":
            return 1.0;
        default:
            return "Unknown";
    }
}

/**
 * Converts a numerical sleep index to a corresponding sleep quality description.
 *
 * The function maps numerical indices to sleep quality descriptions. The ranges are:
 * - 0.3 or less: "Very Poor"
 * - 0.6 or less: "Poor"
 * - 0.8 or less: "Fair"
 * - 0.9 or less: "Good"
 * - 1 or less: "Excellent"
 *
 * @param {number} index - The numerical index representing sleep quality.
 * @returns {string} The corresponding sleep quality description. Returns "Unknown" 
 *   if the index does not fall within the defined ranges.
 *
 * @example
 * // Returns "Good"
 * translateSleepIndex(0.85);
 *
 * @example
 * // Returns "Very Poor"
 * translateSleepIndex(0.2);
 */
const translateSleepIndex = (index) => {
    if (index < 0.3) return "Very Poor";
    if (index < 0.6) return "Poor";
    if (index < 0.8) return "Fair";
    if (index < 0.9) return "Good";
    if (index < 1) return "Excellent";
    return "Unknown";
}

export {
    translateSleepQualityToIndex,
    translateSleepIndex
}
