import { useState, useEffect } from 'react';
import useAPIService from "@/hooks/useAPIService";
import { useAuth } from "@/contexts/AuthContext";
import DeviceList from '@/components/dashboard/DeviceList';
import ChartCarousel from '@/components/dashboard/ChartCarousel';
import DeviceSummary from '@/components/dashboard/DeviceSummary';
import LoadingErrorComponent from '@/components/dashboard/LoadingErrorComponent';
import useLinkedDevices from '@/hooks/useLinkedDevices';
import useChartData from '@/hooks/useChartData';
import { getGraphSummary } from '@/utils';

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

/**
 * Dashboard component for displaying device data and charts.
 * Fetches device data, manages state, and renders charts.
 * @returns {JSX.Element} The Dashboard component.
 */
const Dashboard = () => {
    const { getIdentity } = useAuth();
    const [linkedDevices, setLinkedDevices] = useState([]);
    const { data: devicesData, error: devicesError, loading: devicesLoading } = useAPIService({ action: 'getLinkedDevices' });

    // Refetch avgData when linkedDevices change
    const { data: avgData, error: avgDataError, loading: avgDataLoading, refetch } = useAPIService({
        action: 'getAverageDataAllDevices',
        key: linkedDevices // Using linkedDevices as a key to trigger refetch
    });
    const [selectedItem, setSelectedItem] = useState(0);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [currentDevice, setCurrentDevice] = useState(null);
    const [allDevicesCurrentIndex, setAllDevicesCurrentIndex] = useState(0);
    const [specificDeviceCurrentIndex, setSpecificDeviceCurrentIndex] = useState(0);
    const [overallAverages, setOverallAverages] = useState({});
    const [healthStory, setHealthStory] = useState("");

    const [unlinkedDevices, setUnlinkedDevices] = useState([]);


    // Pass `linkedDevices` to `useChartData` hook

    const { chartsData, averageChartsData, updateCharts } = useChartData(currentDevice, avgData, linkedDevices);
    const { handleLinkDevice, handleUnlinkDevice } = useLinkedDevices({
        devicesData,
        supportedDevices: supportedDevices,
        setLinkedDevices,
        setUnlinkedDevices,
        setSelectedItem,
        setSelectedBrand,
        setSelectedType,
        setCurrentDevice,
        updateCharts
    });

    useEffect(() => {
        if (linkedDevices.length > 0) {
            const adjustedSelectedItem = Math.min(selectedItem, linkedDevices.length - 1);
            const selectedDevice = linkedDevices[adjustedSelectedItem];
            setSelectedItem(adjustedSelectedItem);
            setSelectedBrand(selectedDevice.brand);
            setSelectedType(selectedDevice.type);
            setCurrentDevice(selectedDevice.device);
            updateCharts(selectedDevice.device);
            refetch();
        }
    }, [selectedItem, linkedDevices]);

    useEffect(() => {
        if (selectedBrand !== '') {
            const availableDevices = linkedDevices.filter(device => device.brand === selectedBrand && device.status === 'linked');
            if (availableDevices.length > 0) {
                setSelectedType(availableDevices[0].type);
                setCurrentDevice(availableDevices[0].device);
            }
        }
    }, [selectedBrand, linkedDevices]);

    useEffect(() => {
        if (avgData) {
            setOverallAverages(avgData.overallAverages || {});
        }
    }, [avgData]);

    /**
     * Fetches the health story of the current device.
     * Updates the state with the fetched health story.
     * @async
     * @function
     * @returns {Promise<void>} Promise representing the completion of the operation.
     */
    const handleHealthStory = async () => {
        if (currentDevice) {
            const story = await currentDevice.getHealthStory();
            setHealthStory(story);
        }
    };

    /**
     * Array of chart configurations for specific devices.
     * @type {Array<Object>}
     */
    const specificDeviceGraphs = [
        {
            title: `Heartrate BPM${selectedBrand && selectedType ? ` - (${selectedBrand} ${selectedType})` : ''}`,
            chartId: "healthDataChart",
            labels: chartsData.heartRate?.labels || [],
            datasets: [
                {
                    label: 'Heartrate BPM',
                    data: chartsData.heartRate?.values || [],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    type: 'line',
                }
            ],
            summary: currentDevice ? currentDevice.getAnalysisSummary('heartRate') : 'No device selected'
        },
        {
            title: `Steps Count${selectedBrand && selectedType ? ` - (${selectedBrand} ${selectedType})` : ''}`,
            chartId: "stepsChart",
            labels: chartsData.steps?.labels || [],
            datasets: [
                {
                    label: 'Steps Count',
                    data: chartsData.steps?.values || [],
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    type: 'bar',
                }
            ],
            summary: currentDevice ? currentDevice.getAnalysisSummary('steps') : 'No device selected'
        },
        {
            title: `Calories Burned${selectedBrand && selectedType ? ` - (${selectedBrand} ${selectedType})` : ''}`,
            chartId: "caloriesChart",
            labels: chartsData.calories?.labels || [],
            datasets: [
                {
                    label: 'Calories Burned',
                    data: chartsData.calories?.values || [],
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    type: 'bar',
                }
            ],
            summary: currentDevice ? currentDevice.getAnalysisSummary('caloriesBurned') : 'No device selected'
        },
        {
            title: `Sleep Statistics${selectedBrand && selectedType ? ` - (${selectedBrand} ${selectedType})` : ''}`,
            chartId: "sleepChart",
            labels: chartsData.sleep?.labels || [],
            datasets: [
                {
                    label: 'Sleep Duration (hours)',
                    data: chartsData.sleep?.values || [],
                    backgroundColor: 'rgba(54, 162, 235, 1)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    type: 'line',
                    yAxisID: 'y'
                },
                {
                    label: 'Sleep Quality',
                    data: chartsData.sleep?.valuesY1 || [],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    type: 'line',
                    yAxisID: 'y1'
                }
            ],
            summary: currentDevice ? currentDevice.getAnalysisSummary('sleep') : 'No device selected'
        },
        {
            title: `Stress Management Score${selectedBrand && selectedType ? ` - (${selectedBrand} ${selectedType})` : ''}`,
            chartId: "stressChart",
            labels: chartsData.stress?.labels || [],
            datasets: [
                {
                    label: 'Stress Management Score',
                    data: chartsData.stress?.values || [],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    type: 'line',
                }
            ],
            summary: currentDevice ? currentDevice.getAnalysisSummary('stressLevel') : 'No device selected'
        },
        {
            title: `Oxygen Saturation Levels${selectedBrand && selectedType ? ` - (${selectedBrand} ${selectedType})` : ''}`,
            chartId: "oxygenChart",
            labels: chartsData.oxygen?.labels || [],
            datasets: [
                {
                    label: 'Oxygen Saturation Levels (%)',
                    data: chartsData.oxygen?.values || [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    type: 'line',
                }
            ],
            summary: currentDevice ? currentDevice.getAnalysisSummary('oxygenSaturation') : 'No device selected'
        },
        {
            title: `Blood Pressure${selectedBrand && selectedType ? ` - (${selectedBrand} ${selectedType})` : ''}`,
            chartId: "bloodPressureChart",
            labels: chartsData.bloodPressure?.labels || [],
            datasets: [
                {
                    label: 'Systolic Blood Pressure',
                    data: chartsData.bloodPressure?.systolic || [],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    type: 'line',
                },
                {
                    label: 'Diastolic Blood Pressure',
                    data: chartsData.bloodPressure?.diastolic || [],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    type: 'line',
                }
            ],
            summary: currentDevice ? currentDevice.getAnalysisSummary('bloodPressure') : 'No device selected'
        },
        {
            title: `EEG Data${selectedBrand && selectedType ? ` - (${selectedBrand} ${selectedType})` : ''}`,
            chartId: "eegChart",
            labels: chartsData.eeg?.labels || [],
            datasets: [
                {
                    label: 'Alpha Waves',
                    data: chartsData.eeg?.alpha || [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    type: 'line',
                },
                {
                    label: 'Beta Waves',
                    data: chartsData.eeg?.beta || [],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    type: 'line',
                },
                {
                    label: 'Gamma Waves',
                    data: chartsData.eeg?.gamma || [],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    type: 'line',
                },
                {
                    label: 'Delta Waves',
                    data: chartsData.eeg?.delta || [],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    type: 'line',
                },
                {
                    label: 'Theta Waves',
                    data: chartsData.eeg?.theta || [],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    type: 'line',
                }
            ],
            summary: currentDevice ? currentDevice.getAnalysisSummary('eeg') : 'No device selected'
        }
    ];

    /**
     * Array of chart configurations for all devices.
     * @type {Array<Object>}
     */
    const allDevicesGraphs = [
        {
            title: "Average Heart Rate BPM - All Devices",
            chartId: "avghealthDataChart",
            labels: averageChartsData.heartRate.labels || [],
            datasets: [
                {
                    label: 'Heart Rate BPM',
                    data: averageChartsData.heartRate.values || [],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    type: 'line',
                }
            ],
            summary: getGraphSummary(overallAverages.heartRate, "heartRate")
        },
        {
            title: "Average Steps Count - All Devices",
            chartId: "avgstepsChart",
            labels: averageChartsData.steps.labels || [],
            datasets: [
                {
                    label: 'Steps Count',
                    data: averageChartsData.steps.values || [],
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    type: 'bar',
                }
            ],
            summary: getGraphSummary(overallAverages.steps, "steps")
        },
        {
            title: "Average Calories Burned - All Devices",
            chartId: "avgcaloriesChart",
            labels: averageChartsData.calories.labels || [],
            datasets: [
                {
                    label: 'Calories Burned',
                    data: averageChartsData.calories.values || [],
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    type: 'bar',
                }
            ],
            summary: getGraphSummary(overallAverages.calories, "calories")
        },
        {
            title: "Average Sleep Duration - All Devices",
            chartId: "avgsleepChart",
            labels: averageChartsData.sleep.labels || [],
            datasets: [
                {
                    label: 'Sleep Duration (hours)',
                    data: averageChartsData.sleep.values || [],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    type: 'bar',
                    yAxisID: 'y'
                },
                {
                    label: 'Sleep Quality',
                    data: averageChartsData.sleep.valuesY1 || [],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    type: 'line',
                    yAxisID: 'y1'
                }
            ],
            summary: getGraphSummary(overallAverages.sleep, "sleep")
        }
    ];

    /**
     * Filters out specific device graphs with data.
     * @type {Array<Object>}
     */
    const filteredSpecificDeviceGraphs = linkedDevices.length > 0 ? specificDeviceGraphs.filter(graph => {
        return graph.datasets?.some(dataset => dataset?.data?.length > 0);
    }) : [];

    /**
     * Filters out all devices graphs with data.
     * @type {Array<Object>}
     */
    const filteredAllDevicesGraphs = linkedDevices.length > 0 ? allDevicesGraphs.filter(graph => {
        return graph.datasets?.some(dataset => dataset?.data?.length > 0);
    }) : [];


    return (
        <div className="w-full">
            <div className="mt-24 mb-2 p-4 items-center">
                <h1 className="text-4xl">Welcome back, {getIdentity('emailPrefix')}</h1>
                <p className="text-gray-700 dark:text-slate-500">Inspect your health charts and analytics</p>
            </div>

            <div>
                <LoadingErrorComponent loading={devicesLoading} error={devicesError} />
                <DeviceList
                    currentDevice={currentDevice}
                    handleUnlinkDevice={handleUnlinkDevice}
                    selectedBrand={selectedBrand}
                    selectedType={selectedType}
                    linkedDevices={linkedDevices}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    handleLinkDevice={handleLinkDevice}
                    unlinkedDevices={unlinkedDevices}
                />
            </div>

            <div className="grid grid-cols-12 gap-4 p-4">
                {/* All Devices Graphs Carousel */}
                <div
                    className="col-span-12 lg:col-span-6 flex flex-col justify-center p-8 bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg w-full">
                    <div className="flex flex-col items-center max-w-full overflow-hidden">
                        <h2 className="text-4xl font-semibold mb-6 text-black dark:text-white">All Devices Data Overview</h2>
                        <LoadingErrorComponent loading={avgDataLoading} error={avgDataError} />
                        {filteredAllDevicesGraphs.length > 0 ? (
                            <ChartCarousel
                                graphs={filteredAllDevicesGraphs}
                                currentIndex={allDevicesCurrentIndex}
                                setCurrentIndex={setAllDevicesCurrentIndex}
                            />
                        ) : (
                            <p className="text-gray-700 dark:text-slate-400">No data available for linked devices.</p>
                        )}
                    </div>
                </div>

                {/* Specific Device Graphs Carousel */}
                <div
                    className="col-span-12 lg:col-span-6 flex flex-col justify-center p-8 bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg w-full">
                    <div className="flex flex-col items-center max-w-full overflow-hidden">
                        <h2 className="text-4xl font-semibold mb-6 text-black dark:text-white">Device Data Overview</h2>
                        <LoadingErrorComponent loading={avgDataLoading} error={avgDataError} />
                        <ChartCarousel
                            graphs={filteredSpecificDeviceGraphs}
                            currentIndex={specificDeviceCurrentIndex}
                            setCurrentIndex={setSpecificDeviceCurrentIndex}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col ml-4 mr-4 justify-center items-center p-8 bg-gray-100 dark:bg-slate-900 rounded-lg shadow-lg ">
                {/* Button Section */}
                <div className="w-full flex justify-center mb-8">
                    <button
                        className="bg-green-600 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-400 text-white dark:text-black rounded w-full sm:w-[8rem] sm:h-[4rem]"
                        onClick={handleHealthStory}
                    >
                        View Analysis
                    </button>
                </div>

                {/* Health Story Section */}
                <div className="w-full">
                    {healthStory && (
                        <div className="flex flex-col space-y-4 justify-center items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
                            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-slate-400 w-full">
                                {healthStory.map((paragraph, index) => (
                                    <li key={index} className="mb-2">
                                        {paragraph}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
