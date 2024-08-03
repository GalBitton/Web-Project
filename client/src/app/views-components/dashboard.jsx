import { useState, useEffect } from 'react';
import Device from '@/services/device.js';
import { getGraphSummary } from '@/utils';
import DeviceCard from '../../components/devicecard';
import ChartComponent from '../../components/chart';
import useAPIService from "@/hooks/useAPIService";

const Dashboard = () => {
    const { data: devicesData, error: devicesError, loading: devicesLoading } = useAPIService({action: 'getLinkedDevices'});
    const { data: avgData, error: avgDataError, loading: avgDataLoading } = useAPIService({action: 'getAverageDataAllDevices'});
    const [linkedDevices, setLinkedDevices] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [currentDevice, setCurrentDevice] = useState(null);

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
        sleep: {labels: [], values: [], valuesY1: []}
    });

    // useEffect to set the linked devices
    useEffect (() => {
        const getDevicesData = async () => {
            if (devicesData) {
                const linkedDevices = await createAllDevices();
                setLinkedDevices(linkedDevices);
            }
        };

        getDevicesData();
    }, [devicesData]);

    // useEffect to reload the brand and device options
    useEffect(() => {
        if (selectedBrand !== '') {
            const availableDevices = linkedDevices.filter(device => device.brand === selectedBrand && device.status === 'linked');
            if (availableDevices.length > 0) {
                setSelectedType(availableDevices[0].type);
            }
        }
    }, [selectedBrand]);

    // useEffect to reload the charts when the brand or device changes
    useEffect(() => {
        if (selectedBrand !== '' && selectedType !== '') {
            const model = linkedDevices.find(device => device.brand === selectedBrand && device.type === selectedType);
            if (model && model.status === 'linked') {
                setCurrentDevice(model.device);
            }
        }
    }, [selectedBrand, selectedType, linkedDevices]);

    useEffect(() => {
        if (currentDevice) {
            updateCharts();
        }
    }, [currentDevice]);

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
                const defaultType = linkedDevices.find(device => device.brand === defaultBrand).type;

                setSelectedBrand(defaultBrand);
                setSelectedType(defaultType);
            }
        };

        initializeDevices();
    }, [linkedDevices]);

    const createAllDevices = async () => {
        if (devicesData) {
            return Promise.all(devicesData.map(async (device) => ({
                ...device,
                name: `${device.brand} ${device.type}`,
                imageSrc: '/assets/watches/' + device.brand.toLowerCase() + '-' + device.type.toLowerCase() + '.png',
                device: new Device(device._id),
            })));
        }
        return [];
    };

    const updateCharts = async () => {
        if(!currentDevice)
            return;

        await currentDevice.fetchAnalyzeData();

        const heartRate = currentDevice.getAnalysisData('heartRate');
        const steps = currentDevice.getAnalysisData('steps');
        const calories = currentDevice.getAnalysisData('caloriesBurned');
        const sleep = currentDevice.getAnalysisData('sleep');
        const stress = currentDevice.getAnalysisData('stressLevel');
        const oxygen = currentDevice.getAnalysisData('oxygenSaturation');
        const bloodPressure = currentDevice.getAnalysisData('bloodPressure');
        const eeg = currentDevice.getAnalysisData('eeg');


        setChartsData({
            heartRate,
            steps,
            calories,
            sleep,
            stress,
            oxygen,
            bloodPressure,
            eeg
        });
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
            setCurrentDevice(null);
        }
    };

    const handleBrandChange = (event) => {
        const selectedBrand = event.target.value;
        setSelectedBrand(selectedBrand);
    };

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        setSelectedType(selectedType);
    };

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
                {devicesLoading && <p>Loading...</p>}
                {devicesError && <p>Error: {devicesError}</p>}
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
                {avgDataLoading && <p>Loading...</p>}
                {avgDataError && <p>Error: {avgDataError}</p>}
                <ChartComponent
                    title="Average Heart Rate BPM"
                    chartId="avghealthDataChart"
                    labels={averageChartsData.heartRate.labels}
                    datasets={[
                        {
                            label: 'Heart Rate BPM',
                            data: averageChartsData.heartRate.values,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
                            backgroundColor: 'rgba(153, 102, 255, 0.5)',
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
                            backgroundColor: 'rgba(255, 159, 64, 0.5)',
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
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            type: 'bar',
                            yAxisID: 'y'
                        },
                        {
                            label: 'Sleep Quality',
                            data: averageChartsData.sleep.valuesY1,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            type: 'line',
                            yAxisID: 'y1'
                        }
                    ]}
                    summary={getGraphSummary(overallAverages.sleep, "sleep")}
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
                        value={selectedType} onChange={handleTypeChange}>
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
                            <img src="/assets/unlink.svg" className="w-[2rem] h-[2rem]" alt="Unlink" style={{ maxWidth: '100%', maxHeight: '100%' }}/>
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
                {chartsData.heartRate.labels.length > 0 && (

                    <ChartComponent
                        title="Heartrate BPM"
                        chartId="healthDataChart"
                        labels={chartsData.heartRate.labels}
                        datasets={[
                            {
                                label: 'Heartrate BPM',
                                data: chartsData.heartRate.values,
                                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                type: 'line',
                            }
                        ]}
                        summary={currentDevice ? currentDevice.getAnalysisSummary('heartRate') : 'No device selected'}
                    />
                )}
                {chartsData.steps.labels.length > 0 && (
                    <ChartComponent
                        title="Steps Count"
                        chartId="stepsChart"
                        labels={chartsData.steps.labels}
                        datasets={[
                            {
                                label: 'Steps Count',
                                data: chartsData.steps.values,
                                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                type: 'bar',
                            }
                        ]}
                        summary={currentDevice ? currentDevice.getAnalysisSummary('steps') : 'No device selected'}
                    />
                )}
                {chartsData.calories.labels.length > 0 && (
                    <ChartComponent
                        title="Calories Burned"
                        chartId="caloriesChart"
                        labels={chartsData.calories.labels}
                        datasets={[
                            {
                                label: 'Calories Burned',
                                data: chartsData.calories.values,
                                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                type: 'bar',
                            }
                        ]}
                        summary={currentDevice ? currentDevice.getAnalysisSummary('caloriesBurned') : 'No device selected'}
                    />
                )}
                {chartsData.sleep.labels.length > 0 && (
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
                        summary={currentDevice ? currentDevice.getAnalysisSummary('sleep') : 'No device selected'}
                    />
                )}
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
                            summary={currentDevice ? currentDevice.getAnalysisSummary('stressLevel') : 'No device selected'}
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
                            summary={currentDevice ? currentDevice.getAnalysisSummary('oxygenSaturation') : 'No device selected'}
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
                            summary={currentDevice ? currentDevice.getAnalysisSummary('bloodPressure') : 'No device selected'}
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
                            summary={currentDevice ? currentDevice.getAnalysisSummary('eeg', undefined, undefined) : 'No device selected'}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
