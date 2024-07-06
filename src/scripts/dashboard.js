import { DeviceFactory } from '../device-classes/deviceFactory.js';
import Device from '../device-classes/device.js';
import '../device-classes/samsung.js';
import '../device-classes/apple.js';
import '../device-classes/xiaomi.js';
import '../device-classes/fitbit.js';
import '../device-classes/dreem.js';
import '../device-classes/muse.js';

document.addEventListener('DOMContentLoaded', async () => {
    const devices = {
        "Apple": {
            "devices": {
                "Smartwatch": {
                    "status": "linked"
                }
            }
        },
        "Samsung": {
            "devices": {
                "Smartwatch": {
                    "status": "linked"
                },
                "Bracelet": {
                    "status": "linked"
                }
            }
        },
        "Xiaomi": {
            "devices": {
                "Smartwatch": {
                    "status": "linked"
                },
                "Bracelet": {
                    "status": "linked"
                }
            }
        },
        "FitBit": {
            "devices": {
                "Bracelet": {
                    "status": "linked"
                }
            }
        },
        "Dreem": {
            "devices": {
              "Headband": {
                    "status": "linked"
                }
            }
        },
        "Muse": {
            "devices": {
              "Headband": {
                    "status": "linked"
                }
            }
        }
    }

    const fetchAndCreateDevice = async (brand, device, file) => {
        const data = await Device.fetchData(file);
        return DeviceFactory.createDevice(brand, device, data);
    };

    const destroyChart = (chart) => {
        if (chart) {
            chart.destroy();
        }
    };

    const createCSV = (labels, dataset, fileName) => {
        let csvContent = "data:text/csv;charset=utf-8,";
    
        // Create header row
        const headers = ["Label"];
        if (dataset.length > 0 && typeof dataset[0] === 'object') {
            headers.push(...Object.keys(dataset[0]));
        } else {
            headers.push("Value");
        }
        csvContent += headers.join(",") + "\n";
    
        // Create data rows
        for (let i = 0; i < labels.length; i++) {
            const row = [labels[i]];
            if (typeof dataset[i] === 'object') {
                row.push(...Object.values(dataset[i]));
            } else {
                row.push(dataset[i]);
            }
            csvContent += row.join(",") + "\n";
        }
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const updateSummary = (average, type) => {
        let summaryText = '';
    
        switch (type) {
            case 'heartrate':
                summaryText = `Your average heartbeat per minute is ${average} BPM, which is ${average < 60 ? 'low' : average > 100 ? 'high' : 'normal'}.`;
                document.getElementById('avgHeartRateSummary').textContent = summaryText;
                break;
            case 'steps':
                summaryText = `Your average steps count is ${average}, which is ${average < 5000 ? 'low' : average > 10000 ? 'high' : 'normal'}.`;
                document.getElementById('avgStepsSummary').textContent = summaryText;
                break;
            case 'calories':
                summaryText = `Your average calories burned is ${average} kcal.`;
                document.getElementById('avgCaloriesSummary').textContent = summaryText;
                break;
            case 'sleep':
                summaryText = `Your average sleep duration is ${average} hours, which is ${average < 7 ? 'less than recommended' : 'within recommended range'}.`;
                document.getElementById('avgSleepSummary').textContent = summaryText;
                break;
            default:
                break;
        }
    };

    const calculateOverallAverage = (averages) => {
        const validAverages = averages.filter(item => typeof item === 'number' && !isNaN(item));
        const total = validAverages.reduce((sum, value) => sum + value, 0);
        return (total / validAverages.length).toFixed(2);
    };
    

    const ctxAverageHeartRate = document.getElementById('avghealthDataChart').getContext('2d');
    const ctxAverageSteps = document.getElementById('avgstepsChart').getContext('2d');
    const ctxAverageCalories = document.getElementById('avgcaloriesChart').getContext('2d');
    const ctxAverageSleep = document.getElementById('avgsleepChart').getContext('2d');
    const ctxHeartRate = document.getElementById('healthDataChart').getContext('2d');
    const ctxSteps = document.getElementById('stepsChart').getContext('2d');
    const ctxCalories = document.getElementById('caloriesChart').getContext('2d');
    const ctxSleep = document.getElementById('sleepChart').getContext('2d');
    const ctxStress = document.getElementById('stressChart') ? document.getElementById('stressChart').getContext('2d') : null;
    const ctxStressContainer = document.getElementById('stressChartContainer');
    const ctxOxygen = document.getElementById('oxygenChart') ? document.getElementById('oxygenChart').getContext('2d') : null;
    const ctxBloodPressure = document.getElementById('bloodPressureChart') ? document.getElementById('bloodPressureChart').getContext('2d') : null;
    const ctxEEG = document.getElementById('eegChart') ? document.getElementById('eegChart').getContext('2d') : null;

    let heartRateChart;
    let stepsChart;
    let caloriesChart;
    let sleepChart;
    let stressChart;
    let oxygenChart;
    let bloodPressureChart;
    let eegChart;

    const createAllDevices = async () => {
        const samsungWatch = await fetchAndCreateDevice('Samsung', 'Smartwatch', '../../demo-data/samsung_watch_data_v2.json');
        const samsungBracelet = await fetchAndCreateDevice('Samsung', 'Bracelet', '../../demo-data/samsung_bracelet_data_v2.json');
        const appleWatch = await fetchAndCreateDevice('AppleWatch', 'Smartwatch', '../../demo-data/apple_watch_data_v2.json');
        const xiaomiWatch = await fetchAndCreateDevice('Xiaomi', 'Smartwatch', '../../demo-data/xiaomi_watch_data_v2.json');
        const xiaomiBracelet = await fetchAndCreateDevice('Xiaomi', 'Bracelet', '../../demo-data/xiaomi_bracelet_data_v2.json');
        const fitbitBracelet = await fetchAndCreateDevice('FitbitBracelet', 'Bracelet', '../../demo-data/fitbit_bracelet_data_v2.json');
        const dreemHeadband = await fetchAndCreateDevice('DreemHeadband', 'Headband', '../../demo-data/dreem_headband_data_v2.json');
        const museHeadband = await fetchAndCreateDevice('MuseHeadband', 'Headband', '../../demo-data/muse_headband_data_v2.json');

        return [
            { name: 'Samsung Smartwatch', device: samsungWatch },
            { name: 'Samsung Bracelet', device: samsungBracelet },
            { name: 'Apple Smartwatch', device: appleWatch },
            { name: 'Xiaomi Smartwatch', device: xiaomiWatch },
            { name: 'Xiaomi Bracelet', device: xiaomiBracelet },
            { name: 'FitBit Bracelet', device: fitbitBracelet },
            { name: 'Dreem Headband', device: dreemHeadband },
            { name: 'Muse Headband', device: museHeadband }
        ];
    };

    const linkedDevices = await createAllDevices();
    const labels = linkedDevices.map((device) => device.name);

    const averageCharts = () => {
        const heartRateDataAverage = linkedDevices.map(device => parseFloat(device.device.calculateAverage('heartRate')));
        const stepsDataAverage = linkedDevices.map(device => parseFloat(device.device.calculateAverage('steps')));
        const caloriesDataAverage = linkedDevices.map(device => parseFloat(device.device.calculateAverage('caloriesBurned')));
        const sleepDataAverage = linkedDevices.map(device => parseFloat(device.device.calculateAverage('sleep')));

        const avgHeartRate = calculateOverallAverage(heartRateDataAverage);
        const avgSteps = calculateOverallAverage(stepsDataAverage);
        const avgCalories = calculateOverallAverage(caloriesDataAverage);
        const avgSleep = calculateOverallAverage(sleepDataAverage);

        // Update the summaries
        updateSummary(avgHeartRate, 'heartrate');
        updateSummary(avgSteps, 'steps');
        updateSummary(avgCalories, 'calories');
        updateSummary(avgSleep, 'sleep');

        new Chart(ctxAverageHeartRate, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Heartrate BPM',
                    data: heartRateDataAverage,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Steps Count Chart
        new Chart(ctxAverageSteps, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Steps Count',
                    data: stepsDataAverage,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Calories Burned Chart
        new Chart(ctxAverageCalories, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Calories Burned',
                    data: caloriesDataAverage,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Sleep Data Chart
        new Chart(ctxAverageSleep, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Sleep Duration (hours)',
                    data: sleepDataAverage,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Attach CSV export functionality to the buttons
        document.getElementById('exportAvgHeartRateCSV').addEventListener('click', () => {
            createCSV(labels, heartRateDataAverage, "average_heartrate");
        });
        document.getElementById('exportAvgStepsCSV').addEventListener('click', () => {
            createCSV(labels, stepsDataAverage, "average_steps");
        });
        document.getElementById('exportAvgCaloriesCSV').addEventListener('click', () => {
            createCSV(labels, caloriesDataAverage, "average_calories_burned");
        });
        document.getElementById('exportAvgSleepCSV').addEventListener('click', () => {
            createCSV(labels, sleepDataAverage, "average_sleep");
        });
    }

    const updateCharts = async (selectedBrand, selectedDevice) => {
        destroyChart(heartRateChart);
        destroyChart(stepsChart);
        destroyChart(caloriesChart);
        destroyChart(sleepChart);
        destroyChart(stressChart);
        destroyChart(oxygenChart);
        destroyChart(bloodPressureChart);
        destroyChart(eegChart);

        const modelName = selectedBrand + ' ' + selectedDevice;
        if (selectedDevice === '') {
            return;
        }

        const model = linkedDevices.find(device => device.name === modelName).device;

        const heartRateData = model.data.map(entry => model.getFieldValue(entry, 'heartRate'));
        const heartRateLabels = model.data.map(entry => {
            const date = new Date(entry.timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        });

        const stepsData = model.data.map(entry => model.getFieldValue(entry, 'steps'));
        const stepsLabels = model.data.map(entry => {
            const date = new Date(entry.timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        });

        const caloriesData = model.data.map(entry => model.getFieldValue(entry, 'caloriesBurned'));
        const caloriesLabels = model.data.map(entry => {
            const date = new Date(entry.timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        });

        const sleepData = model.data.map(entry => model.getFieldValue(entry, 'sleep'));
        const sleepDurationData = sleepData.map(sp => sp.duration);
        const sleepQualityData = sleepData.map(sp => sp.quality);
        const sleepLabels = model.data.map(entry => {
            const date = new Date(entry.timestamp);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        });

        heartRateChart = new Chart(ctxHeartRate, {
            type: 'line',
            data: {
                labels: heartRateLabels,
                datasets: [{
                    label: 'Heartrate BPM',
                    data: heartRateData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Steps Count Chart
        stepsChart = new Chart(ctxSteps, {
            type: 'bar',
            data: {
                labels: stepsLabels,
                datasets: [{
                    label: 'Steps Count',
                    data: stepsData,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Calories Burned Chart
        caloriesChart = new Chart(ctxCalories, {
            type: 'bar',
            data: {
                labels: caloriesLabels,
                datasets: [{
                    label: 'Calories Burned',
                    data: caloriesData,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Sleep Data Chart
        sleepChart = new Chart(ctxSleep, {
            type: 'bar',
            data: {
                labels: sleepLabels,
                datasets: [
                    {
                        label: 'Sleep Duration (hours)',
                        data: sleepDurationData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Sleep Quality',
                        data: sleepQualityData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Duration (hours)'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Quality'
                        },
                        ticks: {
                            callback: function(value) {
                                const qualityLabels = ['Unknown', 'Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'];
                                return qualityLabels[value] || value;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(tooltipItem, data) {
                                if (tooltipItem.datasetIndex === 1) {
                                    const qualityLabels = ['Unknown', 'Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'];
                                    return 'Quality: ' + qualityLabels[tooltipItem.raw];
                                }
                            }
                        }
                    }
                }
            }
        });

        // Stress Management Chart
        if ((selectedBrand === 'FitBit' && selectedDevice === 'Bracelet') || (selectedBrand === 'Xiaomi' && selectedDevice === 'Bracelet')) {
            const modelName = selectedBrand + ' ' + selectedDevice;
            const model = linkedDevices.find(device => device.name === modelName).device;
            const stressData = model.data.map(entry => model.getFieldValue(entry, 'stress').score);
            const stressLabels = model.data.map(entry => {
                const date = new Date(entry.timestamp);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            });

            stressChart = new Chart(ctxStress, {
                type: 'line',
                data: {
                    labels: stressLabels,
                    datasets: [{
                        label: 'Stress Management Score Over Time',
                        data: stressData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });


            document.getElementById('exportStressCSV').addEventListener('click', () => {
                createCSV(stressLabels, stressData, `stress_score_${selectedBrand}-${selectedDevice}`);
            });

            ctxStressContainer.classList.remove('hidden');
        } else {
            ctxStressContainer.classList.add('hidden');
        }
    

        // Oxygen Saturation Levels
        if (selectedBrand === 'Samsung' && selectedDevice === 'Smartwatch') {
            const model = linkedDevices.find(device => device.name === selectedBrand + ' ' + selectedDevice).device;
            const oxygenData = model.data.map(entry => model.getFieldValue(entry, 'oxygenSaturation'));
            const oxygenLabels = model.data.map(entry => {
                const date = new Date(entry.timestamp);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            });
            oxygenChart = new Chart(ctxOxygen, {
                type: 'line',
                data: {
                    labels: oxygenLabels,
                    datasets: [{
                        label: 'Oxygen Saturation Levels (%) Over Time',
                        data: oxygenData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('exportOxygenCSV').addEventListener('click', () => {
                createCSV(oxygenLabels, oxygenData, "oxygen_levels");
            });
            
            document.getElementById('oxygenChartContainer').classList.remove('hidden');
        } else {
            document.getElementById('oxygenChartContainer').classList.add('hidden');
        }

        // Blood Pressure Levels
        if (selectedBrand === 'Apple' && selectedDevice === 'Smartwatch') {
            const model = linkedDevices.find(device => device.name === selectedBrand + ' ' + selectedDevice).device;
            const bloodPressureData = model.data.map(entry => model.getFieldValue(entry, "bloodPressure"));
            const systolicData = bloodPressureData.map(bp => bp.systolic);
            const diastolicData = bloodPressureData.map(bp => bp.diastolic);
            const bloodPressureLabels = model.data.map(entry => {
                const date = new Date(entry.timestamp);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            });

            bloodPressureChart = new Chart(ctxBloodPressure, {
                type: 'line',
                data: {
                    labels: bloodPressureLabels,
                    datasets: [
                        {
                            label: 'Systolic Blood Pressure',
                            data: systolicData,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Diastolic Blood Pressure',
                            data: diastolicData,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('exportBloodPressureCSV').addEventListener('click', () => {
                createCSV(bloodPressureLabels, bloodPressureData, "blood_pressure");
            });

            document.getElementById('bloodPressureChartContainer').classList.remove('hidden');
        } else {
            document.getElementById('bloodPressureChartContainer').classList.add('hidden');
        }

        // Oxygen Saturation Levels
        if (selectedDevice === 'Headband') {
            const model = linkedDevices.find(device => device.name === selectedBrand + ' ' + selectedDevice).device;
            const eegData = model.data.map(entry => model.getFieldValue(entry, 'EEG'));
            
            const alphaData = eegData.map(data => data.alpha);
            const betaData = eegData.map(data => data.beta);
            const gammaData = eegData.map(data => data.gamma);
            const deltaData = eegData.map(data => data.delta);
            const thetaData = eegData.map(data => data.theta);

            const eegLabels = model.data.map(entry => {
                const date = new Date(entry.timestamp);
                return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            });

            eegChart = new Chart(ctxEEG, {
                type: 'line',
                data: {
                    labels: eegLabels,
                    datasets: [
                        {
                            label: 'Alpha Waves',
                            data: alphaData,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Beta Waves',
                            data: betaData,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Gamma Waves',
                            data: gammaData,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Delta Waves',
                            data: deltaData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Theta Waves',
                            data: thetaData,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('exportEEGCSV').addEventListener('click', () => {
                createCSV(eegLabels, eegData, "eeg_levels");
            });

            document.getElementById('eegChartContainer').classList.remove('hidden');
        } else {
            document.getElementById('eegChartContainer').classList.add('hidden');
        }


        // Attach CSV export functionality to the buttons
        document.getElementById('exportHeartRateCSV').addEventListener('click', () => {
            createCSV(heartRateLabels, heartRateData, `heartrate_data_${selectedBrand}-${selectedDevice}`);
        });
        document.getElementById('exportStepsCSV').addEventListener('click', () => {
            createCSV(stepsLabels, stepsData, `steps_data_${selectedBrand}-${selectedDevice}`);
        });
        document.getElementById('exportCaloriesCSV').addEventListener('click', () => {
            createCSV(caloriesLabels, caloriesData, `calories_data_${selectedBrand}-${selectedDevice}`);
        });
        document.getElementById('exportSleepCSV').addEventListener('click', () => {
            createCSV(sleepLabels, sleepData, `sleep_data_${selectedBrand}-${selectedDevice}`);
        });
    };
    
    // Populate dropdowns
    const brandOpts = document.querySelector('.brandCmbBox');
    const deviceOpts = document.querySelector('.deviceCmbBox');

    Object.keys(devices).forEach((brand) => {
        brandOpts.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
    
    // Handle selection change
    brandOpts.addEventListener('change', (event) => {
        const selectedBrand = event.target.value;
        deviceOpts.innerHTML = '';
        Object.keys(devices[selectedBrand].devices).forEach((device) => {
            if (devices[selectedBrand].devices[device].status === 'linked') {
                deviceOpts.innerHTML += `<option value="${device}">${device}</option>`;
            }
        });
    
        const selectedDevice = deviceOpts.value;
        updateCharts(selectedBrand, selectedDevice);
    });
    
    deviceOpts.addEventListener('change', (event) => {
        const selectedDevice = event.target.value;
        const selectedBrand = brandOpts.value;
        updateCharts(selectedBrand, selectedDevice);
    });
    
    const unlink = document.querySelector('.unlink');
    unlink.addEventListener('click', () => {
        const selectedDevice = deviceOpts.value;
        const selectedBrand = brandOpts.value;
    
        const image = document.querySelector(`.${selectedBrand.toLowerCase()}-${selectedDevice.toLowerCase()}-img`);
        if (image) {
            image.remove();
        }
    
        if (selectedDevice !== '') {
            // Unlink the device in the devices object
            devices[selectedBrand].devices[selectedDevice].status = 'unlinked';
    
            // Remove the device from the device options dropdown    
            deviceOption = Array.from(deviceOpts.options).find(option => option.text === selectedDevice);;
    
            if (deviceOption) {
                deviceOpts.removeChild(deviceOption);
            }
    
            // Update the charts with the new selection
            deviceOpts.value = '';
            updateCharts(selectedBrand, '');
        }
    });

    // Load and update charts with initial data
    const initialBrand = Object.keys(devices)[0];
    const initialDevice = Object.keys(devices[initialBrand].devices)[0];
    Object.keys(devices[initialBrand].devices).forEach((device) => {
        deviceOpts.innerHTML += `<option>${device}</option>`;
    });

    updateCharts(initialBrand, initialDevice);
    averageCharts();
});
