import React, { useState, useEffect } from 'react';
import { DeviceFactory } from '../../services/deviceFactory';
import Device from '../../services/devices/device';
import '../../services/devices/samsung';
import '../../services/devices/apple';
import '../../services/devices/xiaomi';
import '../../services/devices/fitbit';
import '../../services/devices/dreem';
import '../../services/devices/muse';
import { getGraphSummary, calculateOverallAverage } from '../../utils';
import DeviceCard from '../../components/devicecard';
import ChartComponent from '../../components/chart';

const devicesData = [
    { brand: 'Samsung', type: 'Smartwatch', file: '/demo-data/samsung_watch_data_v2.json', imageSrc: 'assets/watches/samsung-smartwatch.png', hoverLeft: '38vw', status: 'linked' },
    { brand: 'Samsung', type: 'Bracelet', file: '/demo-data/samsung_bracelet_data_v2.json', imageSrc: 'assets/watches/samsung-bracelet.png', hoverLeft: '26vw', status: 'linked' },
    { brand: 'Apple', type: 'Smartwatch', file: '/demo-data/apple_watch_data_v2.json', imageSrc: 'assets/watches/apple-smartwatch.png', hoverLeft: '50vw', status: 'linked' },
    { brand: 'Xiaomi', type: 'Smartwatch', file: '/demo-data/xiaomi_watch_data_v2.json', imageSrc: 'assets/watches/xiaomi-smartwatch.png', hoverLeft: '10vw', status: 'linked' },
    { brand: 'Xiaomi', type: 'Bracelet', file: '/demo-data/xiaomi_bracelet_data_v2.json', imageSrc: 'assets/watches/xiaomi-bracelet.png', hoverLeft: '-4vw', status: 'linked' },
    { brand: 'FitBit', type: 'Bracelet', file: '/demo-data/fitbit_bracelet_data_v2.json', imageSrc: 'assets/watches/fitbit-bracelet.png', hoverLeft: '-16vw', status: 'linked' },
    { brand: 'Dreem', type: 'Headband', file: '/demo-data/dreem_headband_data_v2.json', imageSrc: 'assets/watches/dreem-headband.png', hoverLeft: '-28vw', status: 'linked' },
    { brand: 'Muse', type: 'Headband', file: '/demo-data/muse_headband_data_v2.json', imageSrc: 'assets/watches/muse-headband.png', hoverLeft: '-42vw', status: 'linked' },
];

const Dashboard = () => {
    const [linkedDevices, setLinkedDevices] = useState([]);
    const [chartsData, setChartsData] = useState({
        heartRate: [],
        steps: [],
        calories: [],
        sleep: []
    });
    const [averageChartsData, setAverageChartsData] = useState({
        heartRate: [],
        steps: [],
        calories: [],
        sleep: []
    });
    const [overallAverages, setOverallAverages] = useState({});
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');

    useEffect(() => {
        if (selectedBrand) {
            const availableDevices = devicesData.filter(device => device.brand === selectedBrand && device.status === 'linked');
            if (availableDevices.length > 0) {
                setSelectedDevice(availableDevices[0].type);
            } else {
                setSelectedDevice('');
                setSelectedBrand('');
            }
        }
    }, [selectedBrand]);

    useEffect(() => {
        const initializeDevices = async () => {
            const linkedDevices = await createAllDevices();
            setLinkedDevices(linkedDevices);
            if (linkedDevices.length > 0) {
                setSelectedBrand(linkedDevices[0].brand);
                setSelectedDevice(linkedDevices.find(device => device.brand === linkedDevices[0].brand).type);
            }

            const averageChartsData = {
                heartRate: linkedDevices.map(device => ({ label: device.name, value: parseFloat(device.device.calculateAverage('heartRate')) })),
                steps: linkedDevices.map(device => ({ label: device.name, value: parseFloat(device.device.calculateAverage('steps')) })),
                calories: linkedDevices.map(device => ({ label: device.name, value: parseFloat(device.device.calculateAverage('caloriesBurned')) })),
                sleep: linkedDevices.map(device => ({ label: device.name, value: parseFloat(device.device.calculateAverage('sleep')) }))
            };

            setAverageChartsData(averageChartsData);

            const overallAverages = {
                heartRate: calculateOverallAverage(averageChartsData.heartRate.map(device => device.value)),
                steps: calculateOverallAverage(averageChartsData.steps.map(device => device.value)),
                calories: calculateOverallAverage(averageChartsData.calories.map(device => device.value)),
                sleep: calculateOverallAverage(averageChartsData.sleep.map(device => device.value))
            };

            setOverallAverages(overallAverages);
        };

        initializeDevices();
    }, []);

    const fetchAndCreateDevice = async (brand, device, file) => {
        const data = await Device.fetchData(file);
        return DeviceFactory.createDevice(brand, device, data);
    };

    const createAllDevices = async () => {
        return Promise.all(devicesData.map(async (device) => ({
            ...device,
            name: `${device.brand} ${device.type}`,
            device: await fetchAndCreateDevice(device.brand, device.type, device.file),
        })));
    };

    const getDataEntry = (brand, type, dataEntry) => {
        const model = linkedDevices.find(device => device.brand === brand && device.type === type).device;

        const values = model.data.map(entry => model.getFieldValue(entry, dataEntry));
        const labels = model.data.map(entry => {
            const date = new Date(entry.timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        });

        return { labels, values };
    }

    const updateCharts = async (selectedBrand, selectedDevice) => {
        if (selectedBrand !== '' && selectedDevice !== '') {
            const heartRate = getDataEntry(selectedBrand, selectedDevice, 'heartRate');
            const steps = getDataEntry(selectedBrand, selectedDevice, 'steps');
            const calories = getDataEntry(selectedBrand, selectedDevice, 'caloriesBurned');
            const sleep = getDataEntry(selectedBrand, selectedDevice, 'sleep');
            setChartsData({ heartRate, steps, calories, sleep });
        }
    };

    const handleUnlinkDevice = () => {
        const image = document.querySelector(`.${selectedBrand}-${selectedDevice}-container`);
        if (image) {
            image.remove();
        }

        if (selectedDevice !== '') {
            // Unlink the device in the devices array
            const updatedLinkedDevices = linkedDevices.map((device) => {
                if (device.brand === selectedBrand && device.type === selectedDevice) {
                    return { ...device, status: 'unlinked' };
                }
                return device;
            });

            setLinkedDevices(updatedLinkedDevices);

            // Update the charts with the new selection
            setSelectedDevice('');
            setSelectedBrand('');
            updateCharts('', '');
        }
    };

    const handleBrandChange = (event) => {
        const selectedBrand = event.target.value;
        setSelectedBrand(selectedBrand);
        setSelectedDevice('');
        updateCharts(selectedBrand, selectedDevice);
    };

    const handleDeviceChange = (event) => {
        const selectedDevice = event.target.value;
        setSelectedDevice(selectedDevice);
        updateCharts(selectedBrand, selectedDevice);
    };


    return (
        <div className="dashboard-full-container">
            <div className="mb-2 p-4 items-center">
                <h1 className="text-4xl">Welcome back, John</h1>
                <p className="text-gray-700 dark:text-slate-500">Inspect your health charts and analytics</p>
            </div>

            <div className="bg-gray-100 dark:bg-slate-900 mb-10 w-full">
                <div className="flex justify-center mt-5">
                    <h1 className="text-3xl text-black dark:text-white mt-16">Linked Devices</h1>
                </div>
                <div className="flex justify-center p-8 sm:h-[70vh] md:h-[60vh] lg:h-[35vh] mb-[15rem] lg:mb-0">
                    <div className="linked-devices flex flex-wrap justify-center sm:justify-between items-center w-full p-2 gap-14">
                        {linkedDevices.map(device => (
                            <DeviceCard key={device.name} device={device} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-14 max-w-full">
                <ChartComponent title="Average Heartrate BPM" chartId="avghealthDataChart" data={averageChartsData.heartRate} type="line" summary={getGraphSummary(overallAverages.heartRate, "heartRate")} multiDeviceData={true}/>
                <ChartComponent title="Average Steps Count" chartId="avgstepsChart" data={averageChartsData.steps} type="bar" summary={getGraphSummary(overallAverages.steps, "steps")} multiDeviceData={true}/>
                <ChartComponent title="Average Calories Burned" chartId="avgcaloriesChart" data={averageChartsData.calories} type="bar" summary={getGraphSummary(overallAverages.calories, "calories")} multiDeviceData={true}/>
                <ChartComponent title="Average Sleep Duration" chartId="avgsleepChart" data={averageChartsData.sleep} type="bar" summary={getGraphSummary(overallAverages.sleep, "sleep")} multiDeviceData={true}/>
            </div>

            <div className="flex justify-center items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full mb-10">
                <p className="text-lg text-gray-700 dark:text-slate-400">Select Model: </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-[60rem]">
                    <select className="brandCmbBox bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full sm:w-[10rem]" value={selectedBrand} onChange={handleBrandChange}>
                        <option value="" disabled>Select Brand</option>
                        {[...new Set(devicesData.map(device => device.brand))].map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <select className="deviceCmbBox bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full sm:w-[10rem]" value={selectedDevice} onChange={handleDeviceChange}>
                        <option value="" disabled>Select Device</option>
                        {selectedBrand && devicesData.filter(device => device.brand === selectedBrand && device.status === 'linked').map(device => (
                            <option key={device.type} value={device.type}>{device.type}</option>
                        ))}
                    </select>
                    <button
                        className="unlink bg-red-500 hover:bg-red-700 dark:bg-red-300 dark:hover:bg-red-500 text-white dark:text-black px-4 py-2 rounded w-full sm:w-[8rem]"
                        onClick={handleUnlinkDevice}
                    >
                        <div className="flex items-center gap-2">
                            <img src="assets/unlink.svg" className="w-[2rem] h-[2rem]" alt="Unlink" />
                            Unlink
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-14 max-w-full">
                <ChartComponent title="Heartrate BPM" chartId="healthDataChart" data={chartsData.heartRate} type="line" summary="" />
                <ChartComponent title="Steps Count" chartId="stepsChart" data={chartsData.steps} type="bar" summary="" />
                <ChartComponent title="Calories Burned" chartId="caloriesChart" data={chartsData.calories} type="bar" summary="" />
                <ChartComponent title="Sleep Statistics" chartId="sleepChart" data={chartsData.sleep} type="bar" summary="" />
                <div id="stressChartContainer" className="hidden">
                    <ChartComponent title="Stress Management Score" chartId="stressChart" data={[]} type="line" summary="" />
                </div>
                <div id="oxygenChartContainer" className="hidden">
                    <ChartComponent title="Oxygen Saturation Levels" chartId="oxygenChart" data={[]} type="line" summary="" />
                </div>
                <div id="bloodPressureChartContainer" className="hidden">
                    <ChartComponent title="Blood Pressure" chartId="bloodPressureChart" data={[]} type="line" summary="" />
                </div>
                <div id="eegChartContainer" className="hidden">
                    <ChartComponent title="EEG Data" chartId="eegChart" data={[]} type="line" summary="" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
