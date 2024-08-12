import React, { useRef, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, LineController, BarController, LineElement, BarElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { FiRefreshCw } from 'react-icons/fi';
import Exporter from '@/utils/exporter.js'; // Import the Exporter utility

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, LineController, BarController, LineElement, BarElement, PointElement, Title, Tooltip, Legend, zoomPlugin);

const ResponsiveChartComponent = ({ title, chartId, labels, datasets, summary }) => {
    const chartRef = useRef(null);
    const exporter = new Exporter(); // Instantiate the Exporter

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        const chartInstance = new Chart(ctx, {
            type: datasets[0].type,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'category',
                    },
                    y: {
                        beginAtZero: true,
                        min: 0, // Prevent Y-axis from going below zero
                    }
                },
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
                                y: { min: 0 } // Prevent Y-axis from going below 0 even when zooming out
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

    const handleResetZoom = () => {
        const chartInstance = chartRef.current.chartInstance;
        if (chartInstance) {
            chartInstance.resetZoom();
        }
    };

    return (
        <div className="relative w-full max-w-3xl h-96 mx-auto">
            <h3 className="text-center">{title}</h3>
            <canvas id={chartId} ref={chartRef} className="block w-full h-full"></canvas>
            <p className="text-center mt-4">{summary}</p>
            <button
                onClick={handleResetZoom}
                className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition"
                aria-label="Reset Zoom"
            >
                <FiRefreshCw className="h-6 w-6" />
            </button>
            <div className="flex justify-center space-x-4 mt-4 mb-6"> {/* Added mb-6 for margin-bottom */}
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

export default ResponsiveChartComponent;