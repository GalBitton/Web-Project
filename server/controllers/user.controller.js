import mongoose from 'mongoose';
import User from '../database/models/User.model.js';
import Device from '../database/models/Device.model.js';
import DeviceData from '../database/models/DeviceData.model.js';
import { calculateOverallAverage } from "../utils/mathUtils.js";

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
            const linkedDevices = await Device.find({ user: userId, status: 'linked' }).lean().exec();
            res.status(200).json(linkedDevices);
        } catch (err) {
            this._logger.error('Error retrieving linked devices:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    async getDeviceData(req, res) {
        try {
            const { deviceId } = req.body;
            const deviceData = await DeviceData.findOne({ device: deviceId }).lean().exec();
            if (!deviceData) {
                return res.status(404).json({ error: 'Device data not found' });
            }
            res.status(200).json(deviceData);
        } catch (err) {
            this._logger.error('Error retrieving device data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    async getAverageDataAllDevices(req, res) {
        try {
            const userId = req.user;
            const linkedDevices = await Device.find({ user: userId, status: 'linked' });

            const avgHeartRate = [];
            const avgSteps = [];
            const avgCalories = [];
            const avgSleep = [];

            for (const device of linkedDevices) {
                const deviceData = await DeviceData.findOne({ device: device._id });
                if (deviceData) {
                    const heartRateValues = deviceData.datapoints.map(dp => dp.data.heartRate).filter(value => value);
                    const stepsValues = deviceData.datapoints.map(dp => dp.data.steps).filter(value => value);
                    const caloriesValues = deviceData.datapoints.map(dp => dp.data.caloriesBurned).filter(value => value);
                    const sleepValues = deviceData.datapoints.map(dp => dp.data.sleep && dp.data.sleep.duration).filter(value => value);

                    avgHeartRate.push(calculateOverallAverage(heartRateValues));
                    avgSteps.push(calculateOverallAverage(stepsValues));
                    avgCalories.push(calculateOverallAverage(caloriesValues));
                    avgSleep.push(calculateOverallAverage(sleepValues));
                }
            }

            const overallAverages = {
                heartRate: calculateOverallAverage(avgHeartRate),
                steps: calculateOverallAverage(avgSteps),
                calories: calculateOverallAverage(avgCalories),
                sleep: calculateOverallAverage(avgSleep)
            };

            res.status(200).json(overallAverages);
        } catch (err) {
            this._logger.error('Error retrieving average data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}

export default UserController;
