import React, { useState, useEffect } from 'react';
import Device from '@/services/device.js';
import { getGraphSummary } from '@/utils';
import DeviceCard from '../../components/devicecard';
import ChartComponent from '../../components/chart';
import useAPIService from "@/hooks/useAPIService";

const Dashboard = () => {
    const { data: devicesData, error, loading } = useAPIService({action: 'getLinkedDevices'});
    const { data: avgData } = useAPIService({action: 'getAverageDataAllDevices'});
    const [linkedDevices, setLinkedDevices] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const [chartsData, setChartsData] = useState({
        heartRate: {labels: [], values: []},
        steps: {labels: [], values: []},
        calories: {labels: [], values: []},
        sleep: {labels: [], values: [], valuesY1: []},
        stress: {labels: [], values: []},
        oxygen: {labels: [], values: []},
        bloodPressure: {labels: [], systolic: [], diastolic: []},
        eeg: {labels: [], alpha: [], beta: [], gamma: [], delta: [], theta: []}
    });

    const [overallAverages, setOverallAverages] = useState({});
    const [averageChartsData, setAverageChartsData] = useState({
        heartRate: {labels: [], values: []},
        steps: {labels: [], values: []},
        calories: {labels: [], values: []},
        sleep: {labels: [], values: []}
    });

    // useEffect to set the linked devices
    useEffect (() => {
        const getDevicesData = async () => {
            if (devicesData) {
                const linkedDevices = await createAllDevices(devicesData);
                setLinkedDevices(linkedDevices);
            }
        };

        getDevicesData();
    }, [devicesData]);

    // useEffect to reload the brand and device options
    useEffect(() => {
        if (selectedBrand) {
            const availableDevices = linkedDevices.filter(device => device.brand === selectedBrand && device.status === 'linked');
            if (availableDevices.length > 0) {
                setSelectedType(availableDevices[0].type);
            } else {
                setSelectedType('');
                setSelectedBrand('');
            }
        }
    }, [selectedBrand]);

    // useEffect to reload the charts when the brand or device changes
    useEffect(() => {
        updateCharts(selectedBrand, selectedType);
    }, [selectedType]);

    // useEffect to set the average charts data
    useEffect (() => {
        setAverageChartsData({
            heartRate: avgData?.heartRateAverages || {labels: [], values: []},
            steps: avgData?.stepsAverages || {labels: [], values: []},
            calories: avgData?.caloriesAverages || {labels: [], values: []},
            sleep: avgData?.sleepAverages || {labels: [], values: []}
        });

        setOverallAverages(avgData?.overallAverages || {});
    }, [avgData]);

    // useEffect on mount to initialize the linked devices
    useEffect(() => {
        const initializeDevices = async () => {
            if (linkedDevices.length > 0) {
                const defaultBrand = linkedDevices[0].brand;
                const defaultDevice = linkedDevices.find(device => device.brand === defaultBrand).type;

                setSelectedBrand(defaultBrand);
                setSelectedType(defaultDevice);
            }
        };

        initializeDevices();
    }, [linkedDevices]);

    const createAllDevices = async (devicesData) => {
        if (devicesData) {
            return Promise.all(devicesData.map(async (device) => ({
                ...device,
                name: `${device.brand} ${device.type}`,
                imageSrc: 'assets/watches/' + device.brand.toLowerCase() + '-' + device.type.toLowerCase() + '.png',
                device: new Device(device._id),
            })));
        }
        return [];
    };

    const updateCharts = async (selectedBrand, selectedType) => {
        if (selectedBrand !== '' && selectedType !== '') {
            const model = linkedDevices.find(device => device.brand === selectedBrand && device.type === selectedType);
            if (model && model.device) {
                await model.device.fetchData()
            }

            const heartRate = model.device.data.heartRate;
            const steps = model.device.data.steps;
            const calories = model.device.data.caloriesBurned;
            const sleep = model.device.data.sleep;
            const stress = model.device.data.stress;
            const oxygen = model.device.data.oxygenSaturation;
            const bloodPressure = model.device.data.bloodPressure;
            const eeg = model.device.data.EEG;


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
        const image = document.querySelector(`.${selectedBrand}-${selectedType}-container`);
        if (image) {
            image.remove();
        }

        if (selectedType !== '') {
            // Unlink the device in the devices array
            const updatedLinkedDevices = linkedDevices.map((device) => {
                if (device.brand === selectedBrand && device.type === selectedType) {
                    return {...device, status: 'unlinked'};
                }
                return device;
            });

            setLinkedDevices(updatedLinkedDevices);

            // Update the charts with the new selection
            setSelectedType('');
            setSelectedBrand('');
            updateCharts('', '');
        }
    };

    const handleBrandChange = (event) => {
        const selectedBrand = event.target.value;
        setSelectedBrand(selectedBrand);
        setSelectedType('');
        updateCharts(selectedBrand, selectedType);
    };

    const handleDeviceChange = (event) => {
        const selectedType = event.target.value;
        setSelectedType(selectedType);
        updateCharts(selectedBrand, selectedType);
    };

    if (error) return <div>Error: {error.message}</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-full-container max-w-full">
            <div className="mb-2 p-4 items-center">
                <h1 className="text-4xl">Welcome back, John</h1>
                <p className="text-gray-700 dark:text-slate-500">Inspect your health charts and analytics</p>
            </div>

            <div className="bg-gray-100 dark:bg-slate-900 mb-10 w-full">
                <div className="flex justify-center mt-5">
                    <h1 className="text-3xl text-black dark:text-white mt-16">Linked Devices</h1>
                </div>
                <div className="flex justify-center p-8 sm:h-[105vh] md:h-[80vh] lg:h-[60vh] mb-[15rem] lg:mb-0">
                    <div
                        className="linked-devices flex flex-wrap justify-center sm:justify-between items-center w-full p-2 gap-14">
                        {linkedDevices.map(device => (
                            <DeviceCard key={device.name} device={device}/>
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
                    averageChart={true}
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
                    averageChart={true}
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
                    averageChart={true}
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
                    averageChart={true}
                />
            </div>

            <div
                className="flex justify-center items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full mb-10">
                <p className="text-lg text-gray-700 dark:text-slate-400">Select Model: </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-[60rem]">
                    <select
                        className="brandCmbBox bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full sm:w-[10rem]"
                        value={selectedBrand} onChange={handleBrandChange}>
                        <option value="" disabled>Select Brand</option>
                        {[...new Set(linkedDevices.map(device => device.brand))].map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <select
                        className="deviceCmbBox bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded w-full sm:w-[10rem]"
                        value={selectedType} onChange={handleDeviceChange}>
                        <option value="" disabled>Select Device</option>
                        {selectedBrand && linkedDevices.filter(device => device.brand === selectedBrand && device.status === 'linked').map(device => (
                            <option key={device.type} value={device.type}>{device.type}</option>
                        ))}
                    </select>
                    <button
                        className="unlink bg-red-500 hover:bg-red-700 dark:bg-red-300 dark:hover:bg-red-500 text-white dark:text-black px-4 py-2 rounded w-full sm:w-[8rem]"
                        onClick={handleUnlinkDevice}
                    >
                        <div className="flex items-center gap-2">
                            <img src="assets/unlink.svg" className="w-[2rem] h-[2rem]" alt="Unlink" style={{ maxWidth: '100%', maxHeight: '100%' }}/>
                            Unlink
                        </div>
                    </button>
                </div>
            </div>

            {/*<div*/}
            {/*    className="flex justify-center items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full mb-10">*/}
            {/*    <p className="text-lg text-gray-700 dark:text-slate-400">Select Filters: </p>*/}
            {/*    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-[60rem]">*/}
            {/*    </div>*/}
            {/*</div>*/}

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
                    averageChart={false}
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
                    averageChart={false}
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
                    averageChart={false}
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
                    averageChart={false}
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
                            averageChart={false}
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
                            averageChart={false}
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
                            averageChart={false}
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
                            averageChart={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
