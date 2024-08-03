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

const getDevice = (brand, type) => {
    const device = supportedDevices.find(device => device.brand === brand && device.type === type);
    if (!device) {
        throw new Error(`Device ${brand} ${type} is not supported.`);
    }
    return device;
}

export {
    getSupportedDeviceBrands,
    getSupportedDeviceTypes
};
