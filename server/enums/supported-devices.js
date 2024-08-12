/**
 * List of supported devices.
 * @type {Array<{brand: string, type: string}>}
 */
const supportedDevices = [
    { brand: 'Samsung', type: 'Smartwatch' },
    { brand: 'Samsung', type: 'Bracelet' },
    { brand: 'Apple', type: 'Smartwatch' },
    { brand: 'Xiaomi', type: 'Smartwatch' },
    { brand: 'Xiaomi', type: 'Bracelet' },
    { brand: 'FitBit', type: 'Bracelet' },
    { brand: 'Dreem', type: 'Headband' },
    { brand: 'Muse', type: 'Headband' }
];

/**
 * Get a list of supported device brands.
 * @returns {string[]} An array of supported device brands.
 */
const getSupportedDeviceBrands = () => {
    return [...new Set(supportedDevices.map(device => device.brand))];
};

/**
 * Get a list of supported device types for a specific brand.
 * @param {string} brand - The brand of the device.
 * @returns {string[]} An array of supported device types for the given brand.
 * @throws {Error} If the brand is not supported.
 */
const getSupportedDeviceTypes = (brand) => {
    if (!getSupportedDeviceBrands().includes(brand)) {
        throw new Error(`Brand ${brand} is not supported.`);
    }
    return [...new Set(supportedDevices.filter(device => device.brand === brand).map(device => device.type))];
};

export {
    getSupportedDeviceBrands,
    getSupportedDeviceTypes
};
