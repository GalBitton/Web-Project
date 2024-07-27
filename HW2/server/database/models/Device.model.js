import mongoose from 'mongoose';
import validator from 'validator';
import { getSupportedDeviceBrands, getSupportedDeviceTypes } from "../../enums/supported-devices.js";

const DeviceSchema = new mongoose.Schema({
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
    data: { type: mongoose.Schema.Types.ObjectId, ref: 'DeviceData' }
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
