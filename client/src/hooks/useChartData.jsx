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

    useEffect(() => {
        if (currentDevice) {
            updateCharts(currentDevice);
        } else {
            resetCharts();
        }
    }, [currentDevice]);

    useEffect(() => {
        if (avgData && linkedDevices.length > 0) {
            updateAllDevicesCharts();
        }
    }, [avgData, linkedDevices]);

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
            resetCharts(); // Optionally reset the charts if there's an error
        }
    };

    const updateAllDevicesCharts = () => {
        // Use avgData directly to set the aggregated data for all devices
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