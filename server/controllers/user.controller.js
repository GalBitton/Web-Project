'use strict';

import User from '../database/models/User.model.js';
import Device from '../database/models/Device.model.js';
import DeviceData from '../database/models/DeviceData.model.js';
import HealthStory from "../services/healthStory.js";
import Status from "../enums/device-statuses.js";
import { calculateOverallAverage } from "../utils/mathUtils.js";

class UserController {
    constructor(config, logger, deviceFactory) {
        this._config = config;
        this._logger = logger;
        this._deviceFactory = deviceFactory;

        // Bind methods to ensure 'this' context is correct
        this.getLinkedDevices = this.getLinkedDevices.bind(this);
        this.getDeviceData = this.getDeviceData.bind(this);
        this.linkDevice = this.linkDevice.bind(this);
        this.unlinkDevice = this.unlinkDevice.bind(this);
        this.getAverageDataAllDevices = this.getAverageDataAllDevices.bind(this);
        this.getHealthStatus = this.getHealthStatus.bind(this);
    };

    async linkDevice(req, res) {
        try {
            const userId = req.user;
            const { brand, type } = req.body;
            let device;
            let deviceData;

            device = await Device.findOne({ user: userId, brand, type, status: Status.UNLINKED }).exec();
            if (!device) {
                // Create device and deviceData
                device = new Device({
                    user: userId,
                    brand,
                    type,
                    status: Status.LINKED
                });
                await device.save();

                deviceData = new DeviceData({
                    device: device._id,
                    datapoints: []
                });
                await deviceData.save();

                device.data = deviceData._id;
                await device.save();

                const user = await User.findById(userId).exec();
                user.devices.push(device._id);
                await user.save();
            } else {
                deviceData = await DeviceData.findOne({ device: device._id }).exec();
                if (!deviceData) {
                    this._logger.error('Device data not found, despite existence of deviceId:', device._id);
                    return res.status(404).json({error: 'Device data not found'});
                }
            }

            const deviceId = device._id;
            const deviceInstance = this._deviceFactory.createDevice(brand, type, deviceId, deviceData.lastSeeded);
            const newDataPoints = await this.generateDataPoints(deviceInstance, deviceId);
            console.log(newDataPoints);

            // Push valid data points to datapoints array
            for (let i = 0; i < newDataPoints.length; i++) {
                deviceData.datapoints.push(newDataPoints[i]);
            }

            await deviceData.save();

            const data = deviceInstance.extractGraphData(deviceData.datapoints);
            res.status(200).json({
                device: {
                    _id: deviceId,
                    brand,
                    type,
                    status: device.status
                },
                data,
            });
        } catch (err) {
            this._logger.error('Error linking device:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async unlinkDevice(req, res) {
        try {
            const userId = req.user;
            const { deviceId } = req.params;
            const device = await Device.findOne({_id: deviceId, user: userId}).exec();
            if (!device) {
                return res.status(404).json({error: 'Device not found'});
            }

            device.status = Status.UNLINKED;
            await device.save();
            res.status(200).json({ message: "Device has been unlinked successfully." });
        } catch (err) {
            this._logger.error('Error unlinking device:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    async getLinkedDevices(req, res) {
        try {
            const userId = req.user;
            const linkedDevices = await Device.find({ user: userId, status: Status.LINKED }).lean().exec();
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

            const deviceData = await DeviceData.findOne({ device: deviceId }).exec();
            if (!deviceData) {
                return res.status(404).json({ error: 'Device data not found' });
            }

            const deviceInstance = this._deviceFactory.createDevice(device.brand, device.type, deviceId, deviceData.lastSeeded);
            const validDataPoints = await this.generateDataPoints(deviceInstance, deviceId);

            // Push valid data points to datapoints array
            for (let i = 0; i < validDataPoints.length; i++) {
                deviceData.datapoints.push(validDataPoints[i]);
            }

            await deviceData.save();

            const data = deviceInstance.extractGraphData(deviceData.datapoints);
            res.status(200).json({ ...data });
        } catch (err) {
            this._logger.error('Error retrieving device data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    async getAverageDataAllDevices(req, res) {
        try {
            const userId = req.user;
            const linkedDevices = await Device.find({ user: userId, status: Status.LINKED }).exec();

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

    async getHealthStatus(req, res) {
        try {
            const userId = req.user;
            const { stats } = req.body;

            if (!stats) {
                return res.status(404).json({})
            }

            const healthStory = new HealthStory(stats);
            const healthStatus = healthStory.createStory()
            return res.status(200).json(healthStatus);
        } catch (err) {
            this._logger.error('Error retrieving health status:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };


    /* ================================  Helper Functions ========================== */
    async generateDataPoints(deviceInstance, deviceId) {
        let generatedData = await deviceInstance.seedDatabase();

        // Ensure datapoints is initialized and is an array
        if (!Array.isArray(generatedData)) {
            generatedData = [];
            this._logger.error('Invalid data generated for device:', deviceId);
        }

        // Validate structure of each data point
        return generatedData.map(dataPoint => {
            const { timestamp, ...dataStats } = dataPoint;
            return {
                timestamp,
                data: {
                    ...dataStats
                }
            }
        });
    }
}

export default UserController;
