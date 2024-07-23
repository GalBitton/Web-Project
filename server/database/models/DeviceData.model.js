import mongoose from 'mongoose';

const DataPointSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const DeviceDataSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    datapoints: [DataPointSchema]
}, {
    versionKey: false,
    timestamps: true,
    collection: 'devices-data'
});

// Compound Index for faster query based on device
DeviceDataSchema.index({
    device: 1,
    'datapoints.timestamp': -1
});

const DeviceData = mongoose.model('DeviceData', DeviceDataSchema);

export default DeviceData;
