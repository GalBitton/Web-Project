import React, { useRef, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, LineController, BarController, LineElement, BarElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { TbZoomReset } from 'react-icons/tb';
import Exporter from '@/utils/exporter.js'; // Import the Exporter utility

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, LineController, BarController, LineElement, BarElement, PointElement, Title, Tooltip, Legend, zoomPlugin);

/**
 * ResponsiveChartComponent renders a responsive chart with zoom and pan functionality,
 * along with options to export the chart data to CSV or PDF.
 *
 * @component
 * @param {Object} props - The properties for the ResponsiveChartComponent.
 * @param {string} props.title - The title of the chart.
 * @param {string} props.chartId - The ID for the chart's canvas element.
 * @param {Array<string>} props.labels - The labels for the chart data.
 * @param {Array<Object>} props.datasets - The datasets to display on the chart.
 * @param {string} [props.summary=""] - A summary or description to display below the chart.
 * @returns {JSX.Element} The rendered ResponsiveChartComponent.
 */
const ResponsiveChartComponent = ({ title, chartId, labels, datasets, summary }) => {
    const chartRef = useRef(null);
    const exporter = new Exporter(); // Instantiate the Exporter

    // Quality Mapping
    const qualityMapping = {
        "Unknown": 0,
        "Very Poor": 1,
        "Poor": 2,
        "Fair": 3,
        "Good": 4,
        "Very Good": 5,
        "Excellent": 6
    };

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        const reversedLabels = [...labels].reverse();
        const reversedDatasets = datasets.map(dataset => {
            // If the dataset uses y1 axis, map the qualitative values to numeric equivalents
            if (dataset.yAxisID === 'y1') {
                return {
                    ...dataset,
                    data: dataset.data.map(value => qualityMapping[value] || 0).reverse()
                };
            }
            return {
                ...dataset,
                data: [...dataset.data].reverse()
            };
        });

        const scalesConfig = {
            x: {
                type: 'category',
            },
            y: {
                beginAtZero: true,
                    min: 0, // Prevent Y-axis from going below zero
                    position: 'left',
                    title: {
                    display: true,
                        text: 'Primary Y axis',
                },
            }
        };

        if (datasets.length > 1) {
            scalesConfig.y1 = {
                beginAtZero: true,
                    min: 0,
                    max: 6,
                    position: 'right',
                    grid: {
                    drawOnChartArea: false, // prevent y1 grid lines from appearing on the chart
                },
                title: {
                    display: true,
                        text: 'Secondary Y axis',
                },
                ticks: {
                    // Display the original string labels instead of the numeric values
                    callback: function(value) {
                        return Object.keys(qualityMapping).find(key => qualityMapping[key] === value);
                    }
                }
            }
        }


        const chartInstance = new Chart(ctx, {
            type: datasets[0].type,
            data: {
                labels: reversedLabels,
                datasets: reversedDatasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: scalesConfig,
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy',
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'x',
                            limits: {
                                y: { min: 0 }, // Prevent Y-axis from going below 0 even when zooming out
                                y1: { min: 0, max: 6 }
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });

        // Store the chart instance in the ref
        chartRef.current.chartInstance = chartInstance;

        return () => {
            chartInstance.destroy();
        };
    }, [labels, datasets]);

    /**
     * Resets the zoom level of the chart.
     *
     * @function
     * @name handleResetZoom
     * @returns {void}
     */
    const handleResetZoom = () => {
        const chartInstance = chartRef.current.chartInstance;
        if (chartInstance) {
            chartInstance.resetZoom();
        }
    };

    return (
        <div className="relative flex flex-col mb-20 w-full max-w-3xl h-96 mx-auto">
            <h3 className="text-center mb-6">{title}</h3>
            <canvas id={chartId} ref={chartRef} className="block w-full h-full"></canvas>
            <p className="text-center mt-4 min-h-[3rem]">{summary}</p>

            <div className="flex bottom-0 justify-center space-x-5 mt-6 mb-6"> {/* Added mb-6 for margin-bottom */}
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
                <button
                onClick={handleResetZoom}
                className=" p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition"
                aria-label="Reset Zoom"
            >
                <TbZoomReset className="h-6 w-6" />
            </button>
            </div>
        </div>
    );
};

export default ResponsiveChartComponent;
