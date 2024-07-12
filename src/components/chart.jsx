import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import ExportHandler from '../utils/exportHandler';

const ChartComponent = ({ title, chartId, data, type, summary, multiDeviceData = false }) => {
    const chartRef = useRef(null);
    const exporter = new ExportHandler();
    console.log('data', data);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: type,
            data: {
                labels: multiDeviceData ? data.map(subdata => subdata.label) : data.labels,
                datasets: [{
                    label: title,
                    data: multiDeviceData ? data.map(subdata => subdata.value) : data.values,
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

        return () => {
            chart.destroy();
        };
    }, [data, type, title]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-xl mb-10">
            <h2 className="text-xl mb-4">{title}</h2>
            <canvas ref={chartRef} id={chartId} className="w-full h-64"></canvas>
            <div className="mt-4 text-center">
                <p className="text-lg">{summary}</p>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    className="bg-transparent hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => exporter.exportToCSV(data.labels, data.values, chartId)}
                >
                    <img src="assets/export-csv.svg" alt="Export to CSV" />
                </button>
                <button
                    className="bg-transparent hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => exporter.exportToPDF(data.labels, data.values, chartId)}
                >
                    <img src="assets/export-pdf.svg" alt="Export to PDF" />
                </button>
            </div>
        </div>
    );
};

export default ChartComponent;
