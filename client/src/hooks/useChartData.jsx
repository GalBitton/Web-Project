/**
 * useChartData is a custom hook that manages and updates chart data for various health metrics.
 * It handles both individual device data and aggregated average data from linked devices.
 *
 * @hook
 * @param {Object} currentDevice - The current device object to fetch data from.
 * @param {Object} avgData - The average data for all linked devices.
 * @param {Array} linkedDevices - An array of linked device objects.
 * @returns {Object} An object containing the following:
 * - `chartsData`: An object containing the health metrics data for the current device.
 * - `averageChartsData`: An object containing the aggregated average health metrics data for all linked devices.
 * - `updateCharts`: A function to manually trigger the update of chart data for the current device.
 *
 * @example
 * // Example usage:
 * const { chartsData, averageChartsData, updateCharts } = useChartData(currentDevice, avgData, linkedDevices);
 *
 * useEffect(() => {
 *     if (currentDevice) {
 *         updateCharts(currentDevice);
 *     }
 * }, [currentDevice]);
 */
import { useState, useEffect } from 'react';

const useChartData = (currentDevice, avgData, linkedDevices) => {
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
        sleep: { labels: [], values: [], valuesY1: [] }
    });


    /**
     * Effect hook that updates the aggregated average charts data when new average data or linked devices are available.
     * It triggers the `updateAllDevicesCharts` function to update the average data for all linked devices.
     *
     * @function
     * @name useEffect
     */
    useEffect(() => {
        if (avgData && linkedDevices.length > 0) {
            updateAllDevicesCharts();
        }
    }, [avgData, linkedDevices]);

    /**
     * Resets the charts data to empty values.
     * This function is called when there's an error fetching analysis data for a device.
     */
    const resetCharts = () => {
        setChartsData({
            heartRate: { labels: [], values: [] },
            steps: { labels: [], values: [] },
            calories: { labels: [], values: [] },
            sleep: { labels: [], values: [], valuesY1: [] },
            stress: { labels: [], values: [] },
            oxygen: { labels: [], values: [] },
            bloodPressure: { labels: [], systolic: [], diastolic: [] },
            eeg: { labels: [], alpha: [], beta: [], gamma: [], delta: [], theta: [] }
        });
    };

    /**
     * Updates the charts data for the current device by fetching its analysis data.
     * If the device is not available or there's an error, it resets the charts data.
     *
     * @async
     * @function
     * @param {Object} device - The device object to fetch data from.
     */
    const updateCharts = async (device) => {
        if (!device) {
            console.warn("No device available to fetch data.");
            return;
        }

        try {
            await device.fetchAnalyzeData();
            setChartsData({
                heartRate: device.getAnalysisData('heartRate'),
                steps: device.getAnalysisData('steps'),
                calories: device.getAnalysisData('caloriesBurned'),
                sleep: device.getAnalysisData('sleep'),
                stress: device.getAnalysisData('stressLevel'),
                oxygen: device.getAnalysisData('oxygenSaturation'),
                bloodPressure: device.getAnalysisData('bloodPressure'),
                eeg: device.getAnalysisData('eeg'),
            });
        } catch (error) {
            console.error("Error fetching analysis data for the device:", error);
            resetCharts();
        }
    };

    /**
     * Updates the aggregated average charts data for all linked devices.
     * This function is triggered when new average data is available.
     */
    const updateAllDevicesCharts = () => {
        if (avgData) {
            setAverageChartsData({
                heartRate: avgData.heartRateAverages || { labels: [], values: [] },
                steps: avgData.stepsAverages || { labels: [], values: [] },
                calories: avgData.caloriesAverages || { labels: [], values: [] },
                sleep: avgData.sleepAverages || { labels: [], values: [], valuesY1: [] }
            });
        }
    };

    return {
        chartsData,
        averageChartsData,
        updateCharts,
    };
};

export default useChartData;
