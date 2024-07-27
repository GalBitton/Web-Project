import mongoose from 'mongoose';
import fs from 'fs';
import config from 'config';
import Device from '../models/Device.model.js';
import DeviceData from '../models/DeviceData.model.js';
import {dirname} from "path";
import {fileURLToPath} from "url";

const serverConfig = config.get('server');
const db_uri = serverConfig.db_uri;
const __dirname = dirname(fileURLToPath(import.meta.url));

const jsonFiles = [
    { filePath: '../demo-data/apple_watch_data_v2.json', brand: 'Apple', type: 'Smartwatch' },
    { filePath: '../demo-data/dreem_headband_data_v2.json', brand: 'Dreem', type: 'Headband' },
    { filePath: '../demo-data/fitbit_bracelet_data_v2.json', brand: 'FitBit', type: 'Bracelet' },
    { filePath: '../demo-data/muse_headband_data_v2.json', brand: 'Muse', type: 'Headband' },
    { filePath: '../demo-data/samsung_bracelet_data_v2.json', brand: 'Samsung', type: 'Bracelet' },
    { filePath: '../demo-data/samsung_watch_data_v2.json', brand: 'Samsung', type: 'Smartwatch' },
    { filePath: '../demo-data/xiaomi_bracelet_data_v2.json', brand: 'Xiaomi', type: 'Bracelet' },
    { filePath: '../demo-data/xiaomi_watch_data_v2.json', brand: 'Xiaomi', type: 'Smartwatch' }
];

const migrateData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(db_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        for (const { filePath, brand, type } of jsonFiles) {
            const data = JSON.parse(fs.readFileSync(__dirname + "/" + filePath, 'utf8'));

            // Create a new device entry
            const device = new Device({
                status: 'linked',
                brand: brand,
                type: type
            });

            await device.save();
            console.log(`Saved device: ${brand} ${type}`);

            const datapoints = data.data.map(entry => ({
                timestamp: entry.timestamp,
                data: entry
            }));

            const deviceData = new DeviceData({
                device: device._id,
                datapoints: datapoints
            });

            await deviceData.save();
            console.log(`Saved device data for device: ${brand} ${type}`);
        }

        console.log('Data migration completed successfully');
    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        mongoose.disconnect();
    }
};

migrateData();
