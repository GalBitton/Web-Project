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