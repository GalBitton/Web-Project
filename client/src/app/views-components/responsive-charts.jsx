import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const ResponsiveChartComponent = ({ title, chartId, labels, datasets, summary }) => {
    const chartRef = useRef(null);

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
                className="absolute top-2 right-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
                Reset Zoom
            </button>
        </div>
    );
};

export default ResponsiveChartComponent;
