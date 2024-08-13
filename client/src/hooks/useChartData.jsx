import { useState, useEffect } from 'react';

/**
 * Custom hook to manage chart data for a device.
 *
 * @param {Object} currentDevice - The currently selected device for which to fetch data.
 * @param {Object} avgData - The average data for various metrics.
 * @param {Object} avgData.heartRateAverages - Average heart rate data.
 * @param {Object} avgData.stepsAverages - Average steps data.
 * @param {Object} avgData.caloriesAverages - Average calories data.
 * @param {Object} avgData.sleepAverages - Average sleep data.
 *
 * @returns {Object} - Contains the chart data and a function to update it.
 * @returns {Object} chartsData - Current chart data.
 * @returns {Object} chartsData.heartRate - Heart rate data with `labels` and `values`.
 * @returns {Object} chartsData.steps - Steps data with `labels` and `values`.
 * @returns {Object} chartsData.calories - Calories data with `labels` and `values`.
 * @returns {Object} chartsData.sleep - Sleep data with `labels`, `values`, and `valuesY1`.
 * @returns {Object} chartsData.stress - Stress data with `labels` and `values`.
 * @returns {Object} chartsData.oxygen - Oxygen data with `labels` and `values`.
 * @returns {Object} chartsData.bloodPressure - Blood pressure data with `labels`, `systolic`, and `diastolic`.
 * @returns {Object} chartsData.eeg - EEG data with `labels`, `alpha`, `beta`, `gamma`, `delta`, and `theta`.
 * @returns {Object} averageChartsData - Average chart data.
 * @returns {Object} averageChartsData.heartRate - Average heart rate data with `labels` and `values`.
 * @returns {Object} averageChartsData.steps - Average steps data with `labels` and `values`.
 * @returns {Object} averageChartsData.calories - Average calories data with `labels` and `values`.
 * @returns {Object} averageChartsData.sleep - Average sleep data with `labels`, `values`, and `valuesY1`.
 * @returns {Function} updateCharts - Function to update the chart data.
 */
const useChartData = (currentDevice, avgData) => {
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

    useEffect(() => {
        if (currentDevice) {
            updateCharts(currentDevice);
        } else {
            updateCharts(null);
        }
    }, [currentDevice]);

    useEffect(() => {
        setAverageChartsData({
            heartRate: avgData?.heartRateAverages || { labels: [], values: [] },
            steps: avgData?.stepsAverages || { labels: [], values: [] },
            calories: avgData?.caloriesAverages || { labels: [], values: [] },
            sleep: avgData?.sleepAverages || { labels: [], values: [] }
        });
    }, [avgData]);

    const updateCharts = async (device) => {
        if (!device) {
            // Reset the chart data when there is no device
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
            return;
        }

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
    };

    return {
        chartsData,
        averageChartsData,
        updateCharts, // Ensure updateCharts is returned
    };
};

export default useChartData;