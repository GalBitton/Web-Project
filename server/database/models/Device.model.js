import mongoose from 'mongoose';
import { getSupportedDeviceBrands, getSupportedDeviceTypes } from "../../enums/supported-devices.js";

/**
 * Schema for device documents in MongoDB.
 * 
 * @typedef {Object} DeviceSchema
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the User document.
 * @property {string} status - Status of the device ('linked' or 'unlinked'). Default is 'linked'.
 * @property {string} brand - Brand of the device. Must be one of the supported brands.
 * @property {string} type - Type of the device. Must be valid for the specified brand.
 * @property {mongoose.Schema.Types.ObjectId} data - Reference to the DeviceData document.
 */

/**
 * Device schema definition.
 * 
 * @type {mongoose.Schema}
 */
const DeviceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['linked', 'unlinked'], default: 'linked' },
    brand: { type: String, enum: getSupportedDeviceBrands(), required: true },
    type: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                try {
                    return getSupportedDeviceTypes(this.brand).includes(value);
                } catch (e) {
                    return false;
                }
            },
            message: props => `${props.value} is not a valid type for brand ${props.instance.brand}`
        }
    },
    data: { type: mongoose.Schema.Types.ObjectId, ref: 'DeviceData' },
}, {
    versionKey: false,
    timestamps: false,
    collection: 'devices'
});

// Compound Index
DeviceSchema.index({
    user: 1,
    status: 1,
});

const Device = mongoose.model('Device', DeviceSchema);

export default Device;
