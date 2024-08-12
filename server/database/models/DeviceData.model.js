import mongoose from 'mongoose';
import config from 'config';

// Retrieve data seeding configuration
const dataSeeding = config.get('dataSeeding');


const DataPointSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const DeviceDataSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    datapoints: [DataPointSchema],
    lastSeeded: { type: Date, default: null }
}, {
    versionKey: false,
    timestamps: true,
    collection: 'devices-data'
});

/**
 * Middleware to update the `lastSeeded` timestamp and manage the size of the `datapoints` array.
 * 
 * This pre-save hook updates the `lastSeeded` field to the current date and time
 * if the document is not new. It also ensures that the `datapoints` array does not exceed
 * the limit defined by the `dataSeeding.points` configuration (for one week's worth of data).
 * 
 * @param {Function} next - The next middleware function to call.
 */
DeviceDataSchema.pre('save', function(next) {
    if (!this.isNew) {
        this.lastSeeded = new Date();
    }

    // We save the data only for a week. This is just for the sake of the example.
    // In a real-world scenario, we would probably want to store more data and utilize a more sophisticated
    // data management strategy. For example, we could store the data in a time-series database like InfluxDB.
    // Or partition the data based on time and query it based on the partition key.
    const pointsCap = dataSeeding.points * 24 * 7;
    if (this.datapoints.length > pointsCap) {
        this.datapoints = this.datapoints.slice(-pointsCap);
    }
    next();
})

// Compound Index for faster query based on device
DeviceDataSchema.index({
    device: 1,
    timestamp: -1
});

DeviceDataSchema.index({ device: 1 });

const DeviceData = mongoose.model('DeviceData', DeviceDataSchema);

export default DeviceData;
