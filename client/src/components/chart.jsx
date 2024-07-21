import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Range, getTrackBackground } from 'react-range';
import Exporter from '../utils/exporter.js';

const ChartComponent = ({ title, chartId, labels, datasets, summary = "", averageChart = false }) => {
    const chartRef = useRef(null);
    const exporter = new Exporter();

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const filteredLabels = labels
        const filteredDatasets = datasets

        const colors = [
            { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
            { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
            { background: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' }
        ];

        const chartData = {
            labels: filteredLabels,
            datasets: filteredDatasets.map((dataset, index) => ({
                ...dataset,
                backgroundColor: dataset.backgroundColor || colors[index % colors.length].background,
                borderColor: dataset.borderColor || colors[index % colors.length].border,
                borderWidth: 1,
                yAxisID: dataset.yAxisID || 'y',
            }))
        };

        const yAxes = [
            {
                id: 'y',
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        ];

        if (chartData.datasets.length > 1) {
            yAxes.push({
                id: 'y1',
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Quality'
                },
                ticks: {
                    callback: function (value) {
                        const qualityLabels = ['Unknown', 'Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'];
                        return qualityLabels[value] || value;
                    }
                }
            });
        }

        const chartConfig = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    ...((chartData.datasets.length > 1) && {
                        y1: {
                            beginAtZero: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Quality'
                            },
                            ticks: {
                                callback: function (value) {
                                    const qualityLabels = ['', 'Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'];
                                    return qualityLabels[value] || value;
                                }
                            }
                        }
                    })
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
    }, [datasets, labels, title]);

    return (
        <div data-testid="chart-component" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-xl mb-10">
            <h2 className="text-xl mb-4">{title}</h2>
            <div className="flex flex-col items-center mb-6">
                {/*{!averageChart && (*/}
                {/*    <div>*/}
                {/*        <DatePicker*/}
                {/*            selected={startDate}*/}
                {/*            onChange={(date) => setStartDate(date || initialStartDate)}*/}
                {/*            selectsStart*/}
                {/*            startDate={startDate}*/}
                {/*            endDate={endDate}*/}
                {/*            showTimeSelect*/}
                {/*            dateFormat="Pp"*/}
                {/*            className="mb-2"*/}
                {/*        />*/}
                {/*        <DatePicker*/}
                {/*            selected={endDate}*/}
                {/*            onChange={(date) => setEndDate(date || initialEndDate)}*/}
                {/*            selectsEnd*/}
                {/*            startDate={startDate}*/}
                {/*            endDate={endDate}*/}
                {/*            showTimeSelect*/}
                {/*            dateFormat="Pp"*/}
                {/*            className="mb-4"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*)}*/}
                {/*<Range*/}
                {/*    values={range}*/}
                {/*    step={1}*/}
                {/*    min={0}*/}
                {/*    max={range.length - 1}*/}
                {/*    onChange={(values) => setRange(values)}*/}
                {/*    renderTrack={({ props, children }) => (*/}
                {/*        <div*/}
                {/*            {...props}*/}
                {/*            style={{*/}
                {/*                ...props.style,*/}
                {/*                height: '6px',*/}
                {/*                width: '100%',*/}
                {/*                background: getTrackBackground({*/}
                {/*                    values: range,*/}
                {/*                    colors: ['#ccc', '#548BF4', '#ccc'],*/}
                {/*                    min: 0,*/}
                {/*                    max: range.length - 1,*/}
                {/*                }),*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            {children}*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*    renderThumb={({ props, isDragged }) => (*/}
                {/*        <div*/}
                {/*            {...props}*/}
                {/*            style={{*/}
                {/*                ...props.style,*/}
                {/*                height: '24px',*/}
                {/*                width: '24px',*/}
                {/*                borderRadius: '50%',*/}
                {/*                backgroundColor: '#FFF',*/}
                {/*                border: '1px solid #ccc',*/}
                {/*                boxShadow: '0px 2px 6px #AAA',*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            {isDragged ? <div style={{ position: 'absolute', top: '-28px' }}>{dateLabels[range[0]].toLocaleString()} - {dateLabels[range[1]].toLocaleString()}</div> : ''}*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*/>*/}
            </div>
            <canvas ref={chartRef} id={chartId} className="w-full h-64"></canvas>
            <div className="mt-6 text-center">
                <p className="text-lg">{summary}</p>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
                <button
                    className="bg-transparent hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => exporter.exportToCSV(labels, datasets, title)}
                >
                    <img src="assets/export-csv.svg" alt="Export to CSV" />
                </button>
                <button
                    className="bg-transparent hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => exporter.exportToPDF(labels, datasets, title)}
                >
                    <img src="assets/export-pdf.svg" alt="Export to PDF" />
                </button>
            </div>
        </div>
    );
};

export default ChartComponent;
