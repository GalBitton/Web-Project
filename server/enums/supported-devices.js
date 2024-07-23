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

const getSupportedDeviceBrands = () => {
    return [...new Set(supportedDevices.map(device => device.brand))];
};

const getSupportedDeviceTypes = (brand) => {
    if (!getSupportedDeviceBrands().includes(brand)) {
        throw new Error(`Brand ${brand} is not supported.`);
    }
    return [...new Set(supportedDevices.filter(device => device.brand === brand).map(device => device.type))];
};

const getSupportedDevices = () => supportedDevices;

export {
    getSupportedDeviceBrands,
    getSupportedDeviceTypes,
    getSupportedDevices
};
