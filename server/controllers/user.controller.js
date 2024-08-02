import User from '../database/models/User.model.js';
import Device from '../database/models/Device.model.js';
import DeviceData from '../database/models/DeviceData.model.js';
import { calculateOverallAverage } from "../utils/mathUtils.js";
import { DeviceFactory } from "../services/deviceFactory.js";

class UserController {
    constructor(config, logger) {
        this._config = config;
        this._logger = logger;

        // Bind methods to ensure 'this' context is correct
        this.getLinkedDevices = this.getLinkedDevices.bind(this);
        this.getDeviceData = this.getDeviceData.bind(this);
        this.getAverageDataAllDevices = this.getAverageDataAllDevices.bind(this);
    };

    async getLinkedDevices(req, res) {
        try {
            const userId = req.user;
            const linkedDevices = await Device.find({ status: 'linked' }).lean().exec();
            res.status(200).json(linkedDevices);
        } catch (err) {
            this._logger.error('Error retrieving linked devices:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    async getDeviceData(req, res) {
        try {
            const { deviceId } = req.params;
            const device = await Device.findOne({ _id: deviceId }).lean().exec();
            if (!device) {
                return res.status(404).json({ error: 'Device not found' });
            }

            const deviceData = await DeviceData.findOne({ device: deviceId }).lean().exec();
            if (!deviceData) {
                return res.status(404).json({ error: 'Device data not found' });
            }

            const deviceInstance = DeviceFactory.createDevice(device.brand, device.type, deviceId);
            const data = deviceInstance.extractGraphData(deviceData.datapoints);
            res.status(200).json({ ...data });
        } catch (err) {
            this._logger.error('Error retrieving device data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    async getAverageDataAllDevices(req, res) {
        try {
            const linkedDevices = await Device.find({ status: 'linked' }).exec();

            const heartRateAverages = {labels: [], values: []};
            const stepsAverages = {labels: [], values: []};
            const caloriesAverages = {labels: [], values: []};
            const sleepAverages = {labels: [], values: []};

            for (const device of linkedDevices) {
                const deviceData = await DeviceData.findOne({ device: device._id }).exec();
                const deviceName = `${device.brand} ${device.type}`;

                if (deviceData) {
                    const heartRateValues = deviceData.datapoints.map(dp => dp.data.heartRate).filter(value => value);
                    const stepsValues = deviceData.datapoints.map(dp => dp.data.steps).filter(value => value);
                    const caloriesValues = deviceData.datapoints.map(dp => dp.data.caloriesBurned).filter(value => value);
                    const sleepValues = deviceData.datapoints.map(dp => dp.data.sleep && dp.data.sleep.duration).filter(value => value);

                    heartRateAverages.labels.push(deviceName);
                    heartRateAverages.values.push(parseFloat(heartRateValues.reduce((a, b) => a + b, 0) / heartRateValues.length).toFixed(2));

                    stepsAverages.labels.push(deviceName);
                    stepsAverages.values.push(parseFloat(stepsValues.reduce((a, b) => a + b, 0) / stepsValues.length).toFixed(2));

                    caloriesAverages.labels.push(deviceName);
                    caloriesAverages.values.push(parseFloat(caloriesValues.reduce((a, b) => a + b, 0) / caloriesValues.length).toFixed(2));

                    sleepAverages.labels.push(deviceName);
                    sleepAverages.values.push(parseFloat(sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length).toFixed(2));
                }
            }

            const overallAverages = {
                heartRate: calculateOverallAverage(heartRateAverages.values),
                steps: calculateOverallAverage(stepsAverages.values),
                calories: calculateOverallAverage(caloriesAverages.values),
                sleep: calculateOverallAverage(sleepAverages.values)
            };

            res.status(200).json({ overallAverages, heartRateAverages, stepsAverages, caloriesAverages, sleepAverages });
        } catch (err) {
            this._logger.error('Error retrieving average data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}

export default UserController;
