import mongoose from 'mongoose';
import config from 'config';

const defaultLastSeeded = parseInt(config.get('dataSeeding').defaultLastSeeded);

const DataPointSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const DeviceDataSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    datapoints: [DataPointSchema],
    lastSeeded: {
        type: Date,
        default: () => new Date(Date.now() - defaultLastSeeded * 24 * 60 * 60 * 1000) // 3 days ago
    }
}, {
    versionKey: false,
    timestamps: true,
    collection: 'devices-data'
});

DeviceDataSchema.pre('save', function(next) {
    this.lastSeeded = new Date();
    next();
})

// Compound Index for faster query based on device
DeviceDataSchema.index({
    device: 1,
    timestamp: -1
});

const DeviceData = mongoose.model('DeviceData', DeviceDataSchema);

export default DeviceData;
