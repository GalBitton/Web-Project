import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'react-datepicker/dist/react-datepicker.css';
import Exporter from '@/utils/exporter.js';
import DatePicker from 'react-datepicker';
import moment from 'moment';

/**
 * ChartComponent renders a chart with date range filtering and export options.
 *
 * @component
 * @param {Object} props - The properties for the ChartComponent.
 * @param {string} props.title - The title of the chart.
 * @param {string} props.chartId - The ID for the chart's canvas element.
 * @param {Array<string>} props.labels - The labels for the chart data.
 * @param {Array<Object>} props.datasets - The datasets to display on the chart.
 * @param {string} [props.summary=""] - A summary or description to display below the chart.
 * @returns {JSX.Element} The rendered ChartComponent.
 */
const ChartComponent = ({ title, chartId, labels, datasets, summary = "" }) => {
    const chartRef = useRef(null);
    const exporter = new Exporter();
    const [startDate, setStartDate] = useState(new Date(labels[0])); // Set initial start date to first label date
    const [endDate, setEndDate] = useState(new Date(labels[labels.length - 1])); // Set initial end date to last label date

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        const startDateTime = moment(startDate, "DD-MM-YYYY HH:mm:ss").toISOString();
        const endDateTime = moment(endDate, "DD-MM-YYYY HH:mm:ss").toISOString();

        // Filter data based on the selected date and time range
        const filteredLabels = labels.filter(label => {
            const dateTime = moment(label);
            return dateTime.isBetween(startDateTime, endDateTime, null, '[]');
        });

        const filteredDatasets = datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.filter((_, index) => {
                const dateTime = moment(labels[index]);
                return dateTime.isBetween(startDateTime, endDateTime, null, '[]');
            })
        }));

        // Ensure x-axis ticks are shown
        const chartData = {
            labels: filteredLabels.length > 0 ? filteredLabels : labels, // Fallback to original labels if filtered is empty
            datasets: filteredDatasets.map((dataset, index) => ({
                ...dataset,
                backgroundColor: dataset.backgroundColor || colors[index % colors.length].background,
                borderColor: dataset.borderColor || colors[index % colors.length].border,
                borderWidth: 1,
                yAxisID: dataset.yAxisID || 'y',
            }))
        };

        const chartConfig = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        },
                        ticks: {
                            autoSkip: false, // Ensure all labels are shown
                            maxRotation: 45, // Adjust rotation to avoid overlap
                            minRotation: 45,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function (tooltipItem) {
                                if (tooltipItem.datasetIndex === 1) {
                                    const qualityLabels = ['', 'Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'];
                                    return 'Quality: ' + qualityLabels[tooltipItem.raw];
                                }
                            }
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, chartConfig);

        return () => {
            chart.destroy();
        };
    }, [datasets, labels, startDate, endDate]);

    return (
        <div data-testid="chart-component" className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-xl mb-10">
            <h2 className="text-2xl mb-4 text-black dark:text-white">{title}</h2>
            <div className="w-full h-[50vh] sm:h-[40vh] md:h-[30vh] lg:h-[25vh] xl:h-[20vh]">
                <canvas ref={chartRef} id={chartId} className="w-full h-full"></canvas>
            </div>
            <div className="my-4">
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <div className="flex flex-col">
                        <label className="mb-2 text-center text-black dark:text-white">Start Date & Time</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm:ss"
                            timeIntervals={1}
                            dateFormat="dd-MM-yyyy HH:mm:ss"
                            className="w-full text-center p-2 border border-gray-300 rounded-md dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 text-center text-black dark:text-white">End Date & Time</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm:ss"
                            timeIntervals={1}
                            dateFormat="dd-MM-yyyy HH:mm:ss"
                            className="w-full text-center p-2 border border-gray-300 rounded-md dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-6 text-center">
                <p className="text-lg text-black dark:text-white">{summary}</p>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    className="bg-indigo-400 dark:bg-slate-600 hover:bg-indigo-700 dark:hover:bg-slate-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    onClick={() => exporter.exportToCSV(labels, datasets, title)}
                >
                    <img src="assets/export-csv.svg" alt="Export to CSV" />
                </button>
                <button
                    className="bg-indigo-400 dark:bg-slate-600 hover:bg-indigo-700 dark:hover:bg-slate-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    onClick={() => exporter.exportToPDF(labels, datasets, title)}
                >
                    <img src="assets/export-pdf.svg" alt="Export to PDF" />
                </button>
            </div>
        </div>
    );
};

export default ChartComponent;