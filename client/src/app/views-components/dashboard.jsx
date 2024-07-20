import React, { useState, useEffect } from 'react';
import { DeviceFactory } from '@/services/deviceFactory';
import Device from '../../services/devices/device';
import '../../services/devices/samsung';
import '../../services/devices/apple';
import '../../services/devices/xiaomi';
import '../../services/devices/fitbit';
import '../../services/devices/dreem';
import '../../services/devices/muse';
import { getGraphSummary, calculateOverallAverage } from '@/utils';
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
        heartRate: { labels: [], values: [] },
        steps: { labels: [], values: [] },
        calories: { labels: [], values: [] },
        sleep: { labels: [], values: [], valuesY1: [] },
        stress: { labels: [], values: [] },
        oxygen: { labels: [], values: [] },
        bloodPressure: { labels: [], systolic: [], diastolic: [] },
        eeg: { labels: [], alpha: [], beta: [], gamma: [], delta: [], theta: [] }
    });
    const [averageChartsData, setAverageChartsData] = useState({
        heartRate: { labels: [], values: [] },
        steps: { labels: [], values: [] },
        calories: { labels: [], values: [] },
        sleep: { labels: [], values: [] }
    });
    const [overallAverages, setOverallAverages] = useState({});
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');

    // useEffect to reload the brand and device options
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

    // useEffect to reload the charts when the brand or device changes
    useEffect(() => {
        updateCharts(selectedBrand, selectedDevice);
    }, [selectedDevice]);


    // useEffect on mount to initialize the linked devices
    useEffect(() => {
        const initializeDevices = async () => {
            const linkedDevices = await createAllDevices();
            setLinkedDevices(linkedDevices);
            if (linkedDevices.length > 0) {
                const defaultBrand = linkedDevices[0].brand;
                const defaultDevice = linkedDevices.find(device => device.brand === defaultBrand).type;

                setSelectedBrand(defaultBrand);
                setSelectedDevice(defaultDevice);
            }

            const avgHeartRate = { labels: [], values: [] };
            const avgSteps = { labels: [], values: [] };
            const avgCalories = { labels: [], values: [] };
            const avgSleep = { labels: [], values: [] };

            linkedDevices.forEach(device => {
                avgHeartRate.labels.push(device.name);
                avgHeartRate.values.push(parseFloat(device.device.calculateAverage('heartRate')));

                avgSteps.labels.push(device.name);
                avgSteps.values.push(parseFloat(device.device.calculateAverage('steps')));

                avgCalories.labels.push(device.name);
                avgCalories.values.push(parseFloat(device.device.calculateAverage('caloriesBurned')));

                avgSleep.labels.push(device.name);
                avgSleep.values.push(parseFloat(device.device.calculateAverage('sleep')));
            });

            setAverageChartsData({
                heartRate: avgHeartRate,
                steps: avgSteps,
                calories: avgCalories,
                sleep: avgSleep
            });

            const overallAverages = {
                heartRate: calculateOverallAverage(avgHeartRate.values),
                steps: calculateOverallAverage(avgSteps.values),
                calories: calculateOverallAverage(avgCalories.values),
                sleep: calculateOverallAverage(avgSleep.values)
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
        const model = linkedDevices.find(device => device.brand === brand && device.type === type);
        if (model && model.device) {
            const values = model.device.data.map(entry => model.device.getFieldValue(entry, dataEntry));
            if (values.every(value => value === 0)) {
                return { labels: [], values: [] };
            }

            const labels = model.device.data.map(entry => {
                return new Date(entry.timestamp);
            });

            return { labels, values };
        }
        return { labels: [], values: [] };
    }

    const updateCharts = async (selectedBrand, selectedDevice) => {
        if (selectedBrand !== '' && selectedDevice !== '') {
            const heartRate = getDataEntry(selectedBrand, selectedDevice, 'heartRate');
            const steps = getDataEntry(selectedBrand, selectedDevice, 'steps');
            const calories = getDataEntry(selectedBrand, selectedDevice, 'caloriesBurned');
            const sleep = getDataEntry(selectedBrand, selectedDevice, 'sleep');
            const stress = getDataEntry(selectedBrand, selectedDevice, 'stress');
            const oxygen = getDataEntry(selectedBrand, selectedDevice, 'oxygenSaturation');
            const bloodPressure = getDataEntry(selectedBrand, selectedDevice, 'bloodPressure');
            const eeg = getDataEntry(selectedBrand, selectedDevice, 'EEG');

            setChartsData({
                heartRate,
                steps,
                calories,
                sleep: {
                    labels: sleep.labels,
                    values: sleep.values.map(sp => sp.duration),
                    valuesY1: sleep.values.map(sp => sp.quality)
                },
                stress: {
                    labels: stress.labels,
                    values: stress.values.map(stress => stress.score)
                },
                oxygen,
                bloodPressure: {
                    labels: bloodPressure.labels,
                    systolic: bloodPressure.values.map(bp => bp.systolic),
                    diastolic: bloodPressure.values.map(bp => bp.diastolic)
                },
                eeg: {
                    labels: eeg.labels,
                    alpha: eeg.values.map(data => data.alpha),
                    beta: eeg.values.map(data => data.beta),
                    gamma: eeg.values.map(data => data.gamma),
                    delta: eeg.values.map(data => data.delta),
                    theta: eeg.values.map(data => data.theta)
                }
            });
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
                <ChartComponent
                    title="Average Heartrate BPM"
                    chartId="avghealthDataChart"
                    labels={averageChartsData.heartRate.labels}
                    datasets={[
                        {
                            label: 'Heartrate BPM',
                            data: averageChartsData.heartRate.values,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            type: 'line',
                        }
                    ]}
                    summary={getGraphSummary(overallAverages.heartRate, "heartRate")}
                />
                <ChartComponent
                    title="Average Steps Count"
                    chartId="avgstepsChart"
                    labels={averageChartsData.steps.labels}
                    datasets={[
                        {
                            label: 'Steps Count',
                            data: averageChartsData.steps.values,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            type: 'bar',
                        }
                    ]}
                    summary={getGraphSummary(overallAverages.steps, "steps")}
                />
                <ChartComponent
                    title="Average Calories Burned"
                    chartId="avgcaloriesChart"
                    labels={averageChartsData.calories.labels}
                    datasets={[
                        {
                            label: 'Calories Burned',
                            data: averageChartsData.calories.values,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            type: 'bar',
                        }
                    ]}
                    summary={getGraphSummary(overallAverages.calories, "calories")}
                />
                <ChartComponent
                    title="Average Sleep Duration"
                    chartId="avgsleepChart"
                    labels={averageChartsData.sleep.labels}
                    datasets={[
                        {
                            label: 'Sleep Duration (hours)',
                            data: averageChartsData.sleep.values,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            type: 'bar',
                            yAxisID: 'y'
                        },
                        {
                            label: 'Sleep Quality',
                            data: chartsData.sleep.valuesY1,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            type: 'line',
                            yAxisID: 'y1'
                        }
                    ]}
                    summary={getGraphSummary(overallAverages.sleep, "sleep")}
                />
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
                <ChartComponent
                    title="Heartrate BPM"
                    chartId="healthDataChart"
                    labels={chartsData.heartRate.labels}
                    datasets={[
                        {
                            label: 'Heartrate BPM',
                            data: chartsData.heartRate.values,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            type: 'line',
                        }
                    ]}
                    summary=""
                />
                <ChartComponent
                    title="Steps Count"
                    chartId="stepsChart"
                    labels={chartsData.steps.labels}
                    datasets={[
                        {
                            label: 'Steps Count',
                            data: chartsData.steps.values,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            type: 'bar',
                        }
                    ]}
                    summary=""
                />
                <ChartComponent
                    title="Calories Burned"
                    chartId="caloriesChart"
                    labels={chartsData.calories.labels}
                    datasets={[
                        {
                            label: 'Calories Burned',
                            data: chartsData.calories.values,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            type: 'bar',
                        }
                    ]}
                    summary=""
                />
                <ChartComponent
                    title="Sleep Statistics"
                    chartId="sleepChart"
                    labels={chartsData.sleep.labels}
                    datasets={[
                        {
                            label: 'Sleep Duration (hours)',
                            data: chartsData.sleep.values,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            type: 'bar',
                            yAxisID: 'y'
                        },
                        {
                            label: 'Sleep Quality',
                            data: chartsData.sleep.valuesY1,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            type: 'line',
                            yAxisID: 'y1'
                        }
                    ]}
                    summary=""
                />
                {chartsData.stress.labels.length > 0 && (
                    <div id="stressChartContainer">
                        <ChartComponent
                            title="Stress Management Score"
                            chartId="stressChart"
                            labels={chartsData.stress.labels}
                            datasets={[
                                {
                                    label: 'Stress Management Score',
                                    data: chartsData.stress.values,
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    type: 'line',
                                }
                            ]}
                            summary=""
                        />
                    </div>
                )}
                {chartsData.oxygen.labels.length > 0 && (
                    <div id="oxygenChartContainer">
                        <ChartComponent
                            title="Oxygen Saturation Levels"
                            chartId="oxygenChart"
                            labels={chartsData.oxygen.labels}
                            datasets={[
                                {
                                    label: 'Oxygen Saturation Levels (%)',
                                    data: chartsData.oxygen.values,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    type: 'line',
                                }
                            ]}
                            summary=""
                        />
                    </div>
                )}
                {chartsData.bloodPressure.labels.length > 0 && (
                    <div id="bloodPressureChartContainer">
                        <ChartComponent
                            title="Blood Pressure"
                            chartId="bloodPressureChart"
                            labels={chartsData.bloodPressure.labels}
                            datasets={[
                                {
                                    label: 'Systolic Blood Pressure',
                                    data: chartsData.bloodPressure.systolic,
                                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                    borderColor: 'rgba(255, 159, 64, 1)',
                                    type: 'line',
                                },
                                {
                                    label: 'Diastolic Blood Pressure',
                                    data: chartsData.bloodPressure.diastolic,
                                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                    borderColor: 'rgba(153, 102, 255, 1)',
                                    type: 'line',
                                }
                            ]}
                            summary=""
                        />
                    </div>
                )}
                {chartsData.eeg.labels.length > 0 && (
                    <div id="eegChartContainer">
                        <ChartComponent
                            title="EEG Data"
                            chartId="eegChart"
                            labels={chartsData.eeg.labels}
                            datasets={[
                                {
                                    label: 'Alpha Waves',
                                    data: chartsData.eeg.alpha,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    type: 'line',
                                },
                                {
                                    label: 'Beta Waves',
                                    data: chartsData.eeg.beta,
                                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                    borderColor: 'rgba(153, 102, 255, 1)',
                                    type: 'line',
                                },
                                {
                                    label: 'Gamma Waves',
                                    data: chartsData.eeg.gamma,
                                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                    borderColor: 'rgba(255, 159, 64, 1)',
                                    type: 'line',
                                },
                                {
                                    label: 'Delta Waves',
                                    data: chartsData.eeg.delta,
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    type: 'line',
                                },
                                {
                                    label: 'Theta Waves',
                                    data: chartsData.eeg.theta,
                                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                                    borderColor: 'rgba(255, 206, 86, 1)',
                                    type: 'line',
                                }
                            ]}
                            summary=""
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
