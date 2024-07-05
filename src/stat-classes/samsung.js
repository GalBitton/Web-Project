import Device from "./device.js";

class SamsungWatch extends Device {
    getFieldValue(entry, field) {
        return entry[field];
    }
}

class SamsungBracelet extends Device {
    getFieldValue(entry, field) {
        return entry[field];
    }
}

export {
    SamsungWatch,
    SamsungBracelet
}