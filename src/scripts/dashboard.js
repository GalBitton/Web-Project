import { DeviceFactory } from '../stat-classes/deviceFactory.js';
import Device from '../stat-classes/device.js';
import '../stat-classes/samsung.js';
import '../stat-classes/apple.js';
import '../stat-classes/xiaomi.js';
import '../stat-classes/fitbit.js';
import '../stat-classes/dreem.js';
import '../stat-classes/muse.js';

document.addEventListener('DOMContentLoaded', () => {
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

    const ctxHeartRate = document.getElementById('healthDataChart').getContext('2d');
    const ctxSteps = document.getElementById('stepsChart').getContext('2d');
    const ctxCalories = document.getElementById('caloriesChart').getContext('2d');
    const ctxSleep = document.getElementById('sleepChart').getContext('2d');
    const ctxStress = document.getElementById('stressChart') ? document.getElementById('stressChart').getContext('2d') : null;
    const ctxStressContainer = document.getElementById('fitbitStressChartContainer');

    let heartRateChart;
    let stepsChart;
    let caloriesChart;
    let sleepChart;
    let stressChart;

    const labels = Object.keys(devices);

    const fetchAndCreateDevice = async (brand, device, file) => {
        const data = await Device.fetchData(file);
        return DeviceFactory.createDevice(brand, device, data);
    };

    const destroyChart = (chart) => {
        if (chart) {
            chart.destroy();
        }
    };

    const updateCharts = async (selectedBrand, selectedDevice) => {
        destroyChart(heartRateChart);
        destroyChart(stepsChart);
        destroyChart(caloriesChart);
        destroyChart(sleepChart);
        destroyChart(stressChart);

        const samsungWatch = await fetchAndCreateDevice('Samsung', 'watch', '../../demo-data/samsung_watch_data_v2.json');
        const appleWatch = await fetchAndCreateDevice('AppleWatch', 'watch', '../../demo-data/apple_watch_data_v2.json');
        const xiaomiWatch = await fetchAndCreateDevice('XiaomiWatch', 'watch', '../../demo-data/xiaomi_watch_data_v2.json');
        const xiaomiBracelet = await fetchAndCreateDevice('XiaomiWatch', 'bracelet', '../../demo-data/xiaomi_bracelet_data_v2.json');
        const fitbitBracelet = await fetchAndCreateDevice('FitbitBracelet', 'bracelet', '../../demo-data/fitbit_bracelet_data_v2.json');
        const dreemHeadband = await fetchAndCreateDevice('DreemHeadband', 'headband', '../../demo-data/dreem_headband_data_v2.json');
        const museHeadband = await fetchAndCreateDevice('MuseHeadband', 'headband', '../../demo-data/muse_headband_data_v2.json');

        const devices = [samsungWatch, appleWatch, xiaomiWatch, fitbitBracelet, dreemHeadband, museHeadband];

        const heartRateData = devices.map(device => device.calculateAverage('heartRate'));
        const stepsData = devices.map(device => device.calculateAverage('steps'));
        const caloriesData = devices.map(device => device.calculateAverage('caloriesBurned'));
        const sleepData = devices.map(device => device.calculateAverage('sleep'));

        heartRateChart = new Chart(ctxHeartRate, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Heartrate BPM',
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
                labels: labels,
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
                labels: labels,
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
                labels: labels,
                datasets: [{
                    label: 'Average Sleep Duration (hours)',
                    data: sleepData,
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

        if ((selectedBrand === 'FitBit' && selectedDevice === 'Bracelet') || (selectedBrand === 'Xiaomi' && selectedDevice === 'Bracelet')) {
            const stressDataXiaomi = xiaomiBracelet.data.map(entry => xiaomiBracelet.getFieldValue(entry, 'stress').score);
            const stressDataFitBit = fitbitBracelet.data.map(entry => fitbitBracelet.getFieldValue(entry, 'stress').score);
            const stressData = [...stressDataFitBit, ...stressDataXiaomi];
            ctxStressContainer.classList.remove('hidden');
            // Stress Management Chart
            stressChart = new Chart(ctxStress, {
                type: 'line',
                data: {
                    labels: stressData.map((_, index) => `Entry ${index + 1}`),
                    datasets: [{
                        label: 'Stress Management Score',
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
        } else {
            ctxStressContainer.classList.add('hidden');
        }
    };

    document.getElementById('top-menu-button').addEventListener('click', () => {
        document.getElementById('top-menu').classList.toggle('hidden');
    });

    // Populate dropdowns
    const brandOpts = document.querySelector('.brandCmbBox');
    const deviceOpts = document.querySelector('.deviceCmbBox');

    Object.keys(devices).forEach((brand) => {
        brandOpts.innerHTML += `<option>${brand}</option>`;
    });

    // Handle selection change
    brandOpts.addEventListener('change', (event) => {
        const selectedBrand = event.target.value;
        deviceOpts.innerHTML = '';
        Object.keys(devices[selectedBrand].devices).forEach((device) => {
            if (devices[selectedBrand].devices[device].status === 'linked') {
                deviceOpts.innerHTML += `<option>${device}</option>`;
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
            const deviceOption = deviceOpts.querySelector(`option[value="${selectedDevice}"]`);
            if (deviceOption) {
                deviceOption.remove();
            }

            // Update the charts with the new selection
            deviceOpts.value = '';
            updateCharts(selectedBrand, '');
        }
    });

    const themeToggleButton = document.querySelector('#top-menu .theme-toggle');
    const themeIcon = document.querySelector('.themeIcon');
    const darkModeIcon = 'assets/dark-mode.svg';
    const lightModeIcon = 'assets/light-mode.svg';

    const updateThemeIcon = () => {
        if (document.documentElement.classList.contains('dark')) {
            themeIcon.src = lightModeIcon;
        } else {
            themeIcon.src = darkModeIcon;
        }
    };

    themeToggleButton.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        updateThemeIcon();
    });

    // Initialize the correct icon on load
    updateThemeIcon();

    // Load and update charts with initial data
    const initialBrand = Object.keys(devices)[0];
    const initialDevice = Object.keys(devices[initialBrand].devices)[0];
    Object.keys(devices[initialBrand].devices).forEach((device) => {
        deviceOpts.innerHTML += `<option>${device}</option>`;
    });

    updateCharts(initialBrand, initialDevice);
});
