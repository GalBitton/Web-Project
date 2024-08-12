/**
 * Converts a time duration string into milliseconds.
 *
 * The function takes a string representing a time duration with a numeric part and a unit suffix.
 * Valid units are:
 * - 's' for seconds
 * - 'm' for minutes
 * - 'h' for hours
 * - 'd' for days
 * - 'y' for years
 *
 * @param {string} timeStr - The time duration string to convert. It must end with one of the units: 's', 'm', 'h', 'd', or 'y'.
 * @returns {number} The equivalent duration in milliseconds.
 * @throws {Error} Throws an error if the time string does not end with a valid unit or if the numeric part is not valid.
 *
 * @example
 * // Returns 60000 milliseconds (60 seconds)
 * convertExpirationDateToMilliseconds('60s');
 *
 * @example
 * // Returns 86400000 milliseconds (1 day)
 * convertExpirationDateToMilliseconds('1d');
 */
export function convertExpirationDateToMilliseconds(timeStr) {
    const conversionFactors = {
        s: 1000,               // seconds to milliseconds
        m: 60 * 1000,          // minutes to milliseconds
        h: 60 * 60 * 1000,     // hours to milliseconds
        d: 24 * 60 * 60 * 1000,// days to milliseconds
        y: 365 * 24 * 60 * 60 * 1000 // years to milliseconds
    };

    // Extract the numeric part and the unit part
    const numericPart = parseInt(timeStr.slice(0, -1), 10);
    const unitPart = timeStr.slice(-1);

    // Calculate the result
    if (conversionFactors[unitPart]) {
        return numericPart * conversionFactors[unitPart];
    } else {
        throw new Error("Invalid time format");
    }
}
