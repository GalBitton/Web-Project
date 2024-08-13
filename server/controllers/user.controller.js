'use strict';

import User from '../database/models/User.model.js';
import Device from '../database/models/Device.model.js';
import DeviceData from '../database/models/DeviceData.model.js';
import HealthStory from "../services/healthStory.js";
import Status from "../enums/device-statuses.js";
import { calculateOverallAverage } from "../utils/mathUtils.js";
import { translateSleepIndex, translateSleepQualityToIndex } from "../utils/sleepTranslation.js";

class UserController {
    /**
     * Creates an instance of UserController.
     *
     * @param {Object} config - The configuration object for the controller.
     * @param {Object} logger - The logger instance for logging messages and errors.
     * @param {Object} deviceFactory - The factory used to create device instances.
     */
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
        this.getHealthStory = this.getHealthStory.bind(this);
    };

    /**
     * Links a device to the user.
     *
     * @param {Object} req - The request object containing user ID and device details.
     * @param {Object} res - The response object to send the result or errors.
     * @returns {Promise<void>}
     */
    async linkDevice(req, res) {
        try {
            const userId = req.user;
            const { brand, type } = req.body;
            let device;
            let deviceData;

            device = await Device.findOne({ user: userId, brand, type }).exec();
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
                    datapoints: [],
                    lastSeeded: null
                });
                await deviceData.save();

                device.data = deviceData._id;
                await device.save();

                const user = await User.findById(userId).exec();
                user.devices.push(device._id);
                await user.save();
            } else {
                if (device.status === Status.UNLINKED) {
                    device.status = Status.LINKED;
                    await device.save();
                } else {
                    return res.status(400).json({error: 'Device already linked'});
                }
                deviceData = await DeviceData.findOne({ device: device._id }).sort({ timestamp: -1 }).exec();
                if (!deviceData) {
                    this._logger.error('Device data not found, despite existence of deviceId:', device._id);
                    return res.status(404).json({error: 'Device data not found'});
                }
            }

            const deviceId = device._id;
            const deviceInstance = this._deviceFactory.createDevice(brand, type, deviceId, deviceData.lastSeeded);
            const dataBatches = await this.generateDataPoints(deviceInstance);

            const bulkOps = dataBatches.map(batch => ({
                updateOne: {
                    filter: { device: device._id },
                    update: { $push: { datapoints: { $each: batch } } }
                }
            }));

            // Perform the bulk operation
            await DeviceData.bulkWrite(bulkOps);
            await deviceData.save();

            res.status(200).json({
                device: {
                    _id: deviceId,
                    brand,
                    type,
                    status: device.status
                }
            });
        } catch (err) {
            this._logger.error('Error linking device:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Unlinks a device from the user.
     *
     * @param {Object} req - The request object containing the device ID.
     * @param {Object} res - The response object to send the result or errors.
     * @returns {Promise<void>}
     */
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

    /**
     * Retrieves all linked devices for the user.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object to send the result or errors.
     * @returns {Promise<void>}
     */
    async getLinkedDevices(req, res) {
        try {
            const userId = req.user;
            const linkedDevices = await Device.find({ user: userId, status: Status.LINKED }).select('-user -data').lean().exec();
            res.status(200).json(linkedDevices);
        } catch (err) {
            this._logger.error('Error retrieving linked devices:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    /**
     * Retrieves data for a specific device.
     *
     * @param {Object} req - The request object containing the device ID.
     * @param {Object} res - The response object to send the result or errors.
     * @returns {Promise<void>}
     */
    async getDeviceData(req, res) {
        try {
            const { deviceId } = req.params;
            const device = await Device.findOne({ _id: deviceId }).lean().exec();
            if (!device) {
                return res.status(404).json({ error: 'Device not found' });
            }

            const deviceData = await DeviceData.findOne({ device: deviceId }).sort({ timestamp: -1 }).exec();
            if (!deviceData) {
                return res.status(404).json({ error: 'Device data not found' });
            }

            const deviceInstance = this._deviceFactory.createDevice(device.brand, device.type, deviceId, deviceData.lastSeeded);
            const dataBatches = await this.generateDataPoints(deviceInstance);

            const bulkOps = dataBatches.map(batch => ({
                updateOne: {
                    filter: { device: device._id },
                    update: { $push: { datapoints: { $each: batch } } }
                }
            }));

            // Perform the bulk operation
            await DeviceData.bulkWrite(bulkOps);

            // For lastSeeded.
            await deviceData.save();

            const data = deviceInstance.extractGraphData(deviceData.datapoints);
            res.status(200).json({ ...data });
        } catch (err) {
            this._logger.error('Error retrieving device data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    /**
     * Calculates average data for all linked devices.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object to send the result or errors.
     * @returns {Promise<void>}
     */
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

    /**
     * Generates a health story based on device data.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object to send the result or errors.
     * @returns {Promise<void>}
     */
    async getHealthStory(req, res) {
        try {
            const userId = req.user;
            const linkedDevices = await Device.find({ user: userId, status: Status.LINKED }).exec();

            const metricsByTimestamp = {};

            for (const device of linkedDevices) {
                const deviceData = await DeviceData.findOne({ device: device._id }).exec();
                if (!deviceData) {
                    return res.status(404).json({ error: 'Device data not found' });
                }

                const oneDayAgo = new Date();
                oneDayAgo.setDate(oneDayAgo.getDate() - 1); // Calculate the timestamp for 24 hours ago

                // Filter the datapoints based on the timestamp
                const latestPoints = deviceData.datapoints.filter(point => {
                    return new Date(point.timestamp) >= oneDayAgo;
                });

                const deviceInstance = this._deviceFactory.createDevice(device.brand, device.type, device._id, deviceData.lastSeeded);

                latestPoints.forEach(point => {
                    const timestamp = point.timestamp.toISOString();
                    if (!metricsByTimestamp[timestamp]) {
                        metricsByTimestamp[timestamp] = {
                            heartRate: [],
                            steps: [],
                            caloriesBurned: [],
                            sleepDuration: [],
                            sleepQuality: [],
                            stressScore: [],
                            breathingRate: [],
                            systolicBloodPressure: [],
                            diastolicBloodPressure: [],
                            eegAlpha: [],
                            eegBeta: [],
                            eegGamma: [],
                            eegDelta: [],
                            eegTheta: []
                        };
                    }

                    // Iterate over each field in point.data
                    Object.keys(point.data).forEach(field => {
                        const fieldValue = deviceInstance.getFieldValue(point.data, field);
                        if (field === 'sleep') {
                            if (fieldValue.duration !== undefined) metricsByTimestamp[timestamp].sleepDuration.push(fieldValue.duration);
                            if (fieldValue.quality !== undefined) translateSleepQualityToIndex(metricsByTimestamp[timestamp].sleepQuality.push(fieldValue.quality));
                        } else if (field === 'bloodPressure') {
                            if (fieldValue.systolic !== undefined) metricsByTimestamp[timestamp].systolicBloodPressure.push(fieldValue.systolic);
                            if (fieldValue.diastolic !== undefined) metricsByTimestamp[timestamp].diastolicBloodPressure.push(fieldValue.diastolic);
                        } else if (field === 'EEG') {
                            if (fieldValue.alpha !== undefined) metricsByTimestamp[timestamp].eegAlpha.push(fieldValue.alpha);
                            if (fieldValue.beta !== undefined) metricsByTimestamp[timestamp].eegBeta.push(fieldValue.beta);
                            if (fieldValue.gamma !== undefined) metricsByTimestamp[timestamp].eegGamma.push(fieldValue.gamma);
                            if (fieldValue.delta !== undefined) metricsByTimestamp[timestamp].eegDelta.push(fieldValue.delta);
                            if (fieldValue.theta !== undefined) metricsByTimestamp[timestamp].eegTheta.push(fieldValue.theta)
                        } else if (field === 'stress') {
                            if (fieldValue.score !== undefined) metricsByTimestamp[timestamp].stressScore.push(fieldValue.score);
                        } else {
                            // For other fields like heartRate, steps, etc.
                            if (Array.isArray(metricsByTimestamp[timestamp][field])) {
                                metricsByTimestamp[timestamp][field].push(fieldValue);
                            }
                        }
                    });
                });
            }

            // Calculate the average for each metric at each timestamp
            const calculateAverage = (arr) => arr.length ? arr.reduce((acc, value) => acc + value, 0) / arr.length : null;

            const aggregatedAverages = {
                heartRate: [],
                steps: [],
                caloriesBurned: [],
                sleepDuration: [],
                sleepQuality: [],
                stressScore: [],
                breathingRate: [],
                systolicBloodPressure: [],
                diastolicBloodPressure: [],
                eegAlpha: [],
                eegBeta: [],
                eegGamma: [],
                eegDelta: [],
                eegTheta: []
            };

            Object.keys(metricsByTimestamp).forEach(timestamp => {
                const metrics = metricsByTimestamp[timestamp];
                Object.keys(metrics).forEach(metricKey => {
                    const averageValue = calculateAverage(metrics[metricKey]);
                    if (averageValue !== null) {
                        aggregatedAverages[metricKey].push(averageValue);
                    }
                });
            });

            // Calculate overall average for each metric
            const calculateFinalAverage = (key) => calculateAverage(aggregatedAverages[key]);

            const stats = {
                heartRate: calculateFinalAverage('heartRate'),
                steps: calculateFinalAverage('steps'),
                caloriesBurned: calculateFinalAverage('caloriesBurned'),
                sleep: {
                    duration: calculateFinalAverage('sleepDuration'),
                    quality: translateSleepIndex(calculateFinalAverage('sleepQuality')),
                },
                stressScore: calculateFinalAverage('stressScore'),
                breathingRate: calculateFinalAverage('breathingRate'),
                bloodPressure: {
                    systolic: calculateFinalAverage('systolicBloodPressure'),
                    diastolic: calculateFinalAverage('diastolicBloodPressure'),
                },
                eeg: null
            };


            // Check if any EEG metric is not null
            const eeg = {
                alpha: calculateFinalAverage('eegAlpha'),
                beta: calculateFinalAverage('eegBeta'),
                gamma: calculateFinalAverage('eegGamma'),
                delta: calculateFinalAverage('eegDelta'),
                theta: calculateFinalAverage('eegTheta'),
            };

            if (Object.values(eeg).some(value => value !== null)) {
                stats.eeg = eeg;
            }

            const healthStory = new HealthStory(stats);
            const healthStatus = healthStory.createStory();
            return res.status(200).json(healthStatus);
        } catch (err) {
            this._logger.error('Error retrieving health status:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };


    /* ================================  Helper Functions ========================== */

    /**
     * Generates data points for a device.
     *
     * @param {Object} deviceInstance - The instance of the device.
     * @returns {Promise<Array>} - Returns a promise that resolves with an array of data batches.
     */
    async generateDataPoints(deviceInstance) {
        const generatedDataBatches = await deviceInstance.seedDatabase();

        // Ensure datapoints are initialized and are arrays
        const validBatches = generatedDataBatches.map(batch => {
            if (!Array.isArray(batch)) {
                this._logger.error('Invalid data generated for device');
                return [];
            }

            // Validate and structure each data point within the batch
            const structuredBatch = batch.map(dataPoint => {
                const { timestamp, ...dataStats } = dataPoint;
                return {
                    timestamp,
                    data: { ...dataStats }
                };
            });

            // Sort each batch by timestamp from oldest to most recent
            structuredBatch.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            return structuredBatch;
        });

        return validBatches;
    }
}

export default UserController;
