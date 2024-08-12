import { useState, useEffect } from 'react';

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