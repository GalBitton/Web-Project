import { useState, useEffect } from 'react';
import Device from '@/services/device.js';
import { getGraphSummary } from '@/utils';
import DeviceCard from '../../components/devicecard';
import ChartComponent from '../../components/chart';
import { useAuth } from "@/contexts/AuthContext";
import useAPIService from "@/hooks/useAPIService";
import APIService from "@/services/api/APIService";
import LoadingAnimation from '../../components/loading';
import ResponsiveChartComponent from './responsive-charts';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const supportedDevices = [
    { brand: 'Samsung', type: 'Smartwatch' },
    { brand: 'Samsung', type: 'Bracelet' },
    { brand: 'Apple', type: 'Smartwatch' },
    { brand: 'Xiaomi', type: 'Smartwatch' },
    { brand: 'Xiaomi', type: 'Bracelet' },
    { brand: 'FitBit', type: 'Bracelet' },
    { brand: 'Dreem', type: 'Headband' },
    { brand: 'Muse', type: 'Headband' }
];

const Dashboard = () => {
    const { data: devicesData, error: devicesError, loading: devicesLoading } = useAPIService({action: 'getLinkedDevices'});
    const { data: avgData, error: avgDataError, loading: avgDataLoading } = useAPIService({action: 'getAverageDataAllDevices'});
    const { getIdentity } = useAuth();
    const [linkedDevices, setLinkedDevices] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedDeviceToLink, setSelectedDeviceToLink] = useState('');
    const [unlinkedDevices, setUnlinkedDevices] = useState([]);
    const [currentDevice, setCurrentDevice] = useState(null);
    const [healthStory, setHealthStory] = useState("");

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
                const availableDevices = supportedDevices.filter(device =>
                    !linkedDevices.some(linked => linked.brand === device.brand && linked.type === device.type)
                );
                setUnlinkedDevices(availableDevices);
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

    const handleLinkDevice = async (brand, type) => {
        const apiService = new APIService({action: 'linkDevice', brand: brand, type: type });
        const newDevice = await apiService.execute();
        // newDevice might be null if the device is already linked somehow
        if (newDevice) {
            setLinkedDevices([...linkedDevices, newDevice])
            await updateCharts();
        }
    };

    const handleUnlinkDevice = async () => {
        const image = document.querySelector(`.${selectedBrand}-${selectedType}-container`);
        if (image) {
            image.remove();
        }

        if (selectedType !== '') {
            let deviceId;
            // Unlink the device in the devices array
            const updatedLinkedDevices = linkedDevices.map((device) => {
                if (device.brand === selectedBrand && device.type === selectedType) {
                    deviceId = device.device.id;
                    return {...device, status: 'unlinked'};
                }
                return device;
            });

            const apiService = new APIService({action: 'unlinkDevice', deviceId });
            await apiService.execute();
            setLinkedDevices(updatedLinkedDevices);

            // Update the charts with the new selection
            setSelectedType('');
            setSelectedBrand('');
            setCurrentDevice(null);
        }
    };

    const handleDeviceLinkChange = (event) => {
        const selectedDevice = event.target.value;
        setSelectedDeviceToLink(selectedDevice);
    };

    const handleHealthStory = async () => {
        const apiService = new APIService({action: 'getHealthStory' });
        const story = await apiService.execute();
        setHealthStory(story);
    }

    const handleBrandChange = (event) => {
        const selectedBrand = event.target.value;
        setSelectedBrand(selectedBrand);
    };

    const handleTypeChange = (event) => {
        const selectedType = event.target.value;
        setSelectedType(selectedType);
    };
    
    const [isVisible, setIsVisible] = useState(false);

    const handlePlusClick = () => {
        setIsVisible(!isVisible);
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    const graphs = [
        {
            title: "Average Heart Rate BPM",
            chartId: "avghealthDataChart",
            labels: averageChartsData.heartRate.labels,
            datasets: [
                {
                    label: 'Heart Rate BPM',
                    data: averageChartsData.heartRate.values,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    type: 'line',
                }
            ],
            summary: getGraphSummary(overallAverages.heartRate, "heartRate")
        },
        {
            title: "Average Steps Count",
            chartId: "avgstepsChart",
            labels: averageChartsData.steps.labels,
            datasets: [
                {
                    label: 'Steps Count',
                    data: averageChartsData.steps.values,
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    type: 'bar',
                }
            ],
            summary: getGraphSummary(overallAverages.steps, "steps")
        },
        {
            title: "Average Calories Burned",
            chartId: "avgcaloriesChart",
            labels: averageChartsData.calories.labels,
            datasets: [
                {
                    label: 'Calories Burned',
                    data: averageChartsData.calories.values,
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    type: 'bar',
                }
            ],
            summary: getGraphSummary(overallAverages.calories, "calories")
        },
        {
            title: "Average Sleep Duration",
            chartId: "avgsleepChart",
            labels: averageChartsData.sleep.labels,
            datasets: [
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
            ],
            summary: getGraphSummary(overallAverages.sleep, "sleep")
        }
    ];

    
    return (
        <div className="dashboard-full-container max-w-full">
            <div className="mt-24 mb-2 p-4 items-center">
                <h1 className="text-4xl">Welcome back, {getIdentity('emailPrefix')}</h1>
                <p className="text-gray-700 dark:text-slate-500">Inspect your health charts and analytics</p>
            </div>

            <div
                className="flex-container flex-wrap bg-gray-100 dark:bg-slate-900 ml-4 mr-4 rounded-lg shadow-lg pb-5 mb-4">

                <div className="relative flex justify-center items-center">
                    <div className='flex items-center'>
                        <h1 className="text-3xl text-black dark:text-white mt-8">Linked Devices</h1>
                    </div>

                    <div
                        className={`flex absolute right-0 transition-opacity duration-250 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

                        <div className="flex mr-24 absolute right-0 ">
                            <div>
                                <button
                                    className="unlink mr-1 bg-green-600 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-400 text-white dark:text-black px-4 py-2 rounded-lg w-full sm:w-[8rem]"
                                    onClick={async () => {
                                        const model = selectedDeviceToLink.split("-");
                                        await handleLinkDevice(model[0], model[1]);
                                    }}>Link
                                </button>
                            </div>
                            <div>
                                <select
                                    className="brandCmbBox bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded-lg w-full sm:w-[10rem] min-w-[10rem]"

                                    value={selectedDeviceToLink} onChange={handleDeviceLinkChange}>
                                    <option selected>Choose Device</option>
                                    {unlinkedDevices.map((device, index) => (
                                        <option key={index}
                                                value={`${device.brand}-${device.type}`}>{device.brand + " " + device.type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div
                        className="unlink bg-green-600 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-400 text-white dark:text-black rounded-full w-[3rem] h-[3rem] flex items-center justify-center absolute right-0 mt-10 mr-10 transform transition-transform duration-300 hover:rotate-90">
                        <div
                            className="absolute inset-0 z-[-1] rounded-full opacity-40 bg-gradient-to-r from-green-400 to-green-600 blur-md"></div>
                        <button onClick={handlePlusClick}>
                            {/* Plus Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                        </button>
                    </div>
                </div>
                {devicesLoading && <LoadingAnimation/>}
                {devicesError && <p>Error: {devicesError}</p>}
                <div className="flex-1 justify-center p-10 mb-[15rem] lg:mb-0">

                    <div className="linked-devices flex justify-center items-center w-full p-2">
                        <Carousel
                            selectedItem={linkedDevices.findIndex(device => device.brand === selectedBrand && device.type === selectedType)}
                            showThumbs={true}
                            showIndicators={true}
                            showStatus={true}
                            infiniteLoop={true} // Enable infinite loop
                            centerMode={true} // Center the carousel
                            centerSlidePercentage={linkedDevices.length > 0 ? 80 : 100} // Control the width of each slide
                            swipeable={true} // Allow swiping
                        >
                            {linkedDevices.length > 0 ? linkedDevices.map(device => (
                                <div key={device.name} className="flex justify-center">
                                    <DeviceCard device={device}/>
                                </div>
                            )) : (
                                <div className="flex justify-center">
                                    <p>No devices linked yet. Please link a device.</p>
                                </div>
                            )}
                        </Carousel>
                    </div>
                </div>
            </div>

            <div className="justify-center m-4 p-8 bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg flex-grow">
                <div className="flex flex-col items-center max-w-full overflow-hidden">
                    <h2 className="text-4xl font-semibold mb-6 text-black dark:text-white">Device Data Overview</h2>
                    {avgDataLoading && <LoadingAnimation/>}
                    {avgDataError && <p>Error: {avgDataError.message}</p>}

                    {/* Carousel for the chart components */}
                    <Carousel
                        selectedItem={currentIndex}
                        showThumbs={false}
                        showIndicators={true} // Show dots for navigation
                        showStatus={true}
                        infiniteLoop={true} // Enable infinite loop
                        swipeable={true} // Allow swiping
                        useKeyboardArrows={true} // Allow keyboard navigation
                        onChange={(index) => setCurrentIndex(index)} // Update currentIndex when the slide changes
                        className="w-full max-w-[100vw]" // Ensure the carousel does not exceed the viewport width
                    >
                        {graphs.map((graph, index) => (
                            <div key={index} className="flex justify-center">
                                <ResponsiveChartComponent
                                    title={graph.title}
                                    chartId={graph.chartId}
                                    labels={graph.labels}
                                    datasets={graph.datasets}
                                    summary={graph.summary}
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

            <div className="flex justify-center m-4 p-8 bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg flex-grow">
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
                            <img src="/assets/unlink.svg" className="w-[2rem] h-[2rem]" alt="Unlink"
                                 style={{maxWidth: '100%', maxHeight: '100%'}}/>
                            Unlink
                        </div>
                    </button>
                    <button
                        className="bg-green-600 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-400 text-white dark:text-black px-4 py-2 rounded w-full sm:w-[8rem] sm:h-[4rem]"
                        onClick={handleHealthStory}>View Analysis
                    </button>
                </div>
            </div>
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
            {healthStory && (
                // Styled div to display a large text
                <div
                    className="flex justify-center items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full mb-10">
                    <p className="text-lg text-gray-700 dark:text-slate-400">{healthStory}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
