// src/tests/components.tests.js
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ChartComponent from '../../components/chart.jsx';
import DeviceCard from '../../components/devicecard.jsx';
import Footer from '../../components/layouts/footer.jsx';
import TextCard from '../../components/textcard.jsx';
import Menu from '../../components/layouts/menu.jsx';
import ProfileMenu from '../../components/layouts/profile-menu.jsx';
import { useAuth } from '../../hooks/AuthContext.jsx';
import { AppProvider } from '../../hooks/AppProvider';

// Mock the useAuth hook
jest.mock('../../hooks/AuthContext.jsx', () => ({
    useAuth: jest.fn(),
}));

test('renders AppProvider component', () => {
    const { getByTestId } = render(<AppProvider />);
    expect(getByTestId('app-provider')).toBeInTheDocument();
});

test('renders ProfileMenu component', () => {
    useAuth.mockImplementation(() => ({
        isLoggedIn: true,
    }));

    render(<ProfileMenu />);
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
});

test('renders Menu component', () => {
    // Mock implementation of useAuth
    useAuth.mockImplementation(() => ({
        isLoggedIn: true,
    }));

    render(<Menu />);

    expect(screen.getByTestId('menu-component')).toBeInTheDocument();
});

test('renders TextCard component with content', () => {
    const { getByText } = render(<TextCard text="Some text" index={1} />);
    expect(getByText('Some text')).toBeInTheDocument();
});

test('renders Footer component', () => {
    const { getByTestId } = render(<Footer />);
    expect(getByTestId('footer-component')).toBeInTheDocument();
});

test('renders DeviceCard component with device details', () => {
    const device = {
        name: 'Device 1',
        imageSrc: '/path/to/device1.png',
        brand: 'brandname',
        type: 'devicetype'
    };

    render(<DeviceCard device={device} />);

    // Check if the device name is rendered correctly (which should appear on hover)
    expect(screen.getByText('Device 1')).toBeInTheDocument();

    // Check if the image is rendered correctly
    const imgElements = screen.getAllByAltText('Device 1');
    expect(imgElements).toHaveLength(1);

    // Check if the hover image is rendered correctly
    const hoverImgElements = screen.getAllByAltText('Device 1 hover');
    expect(hoverImgElements).toHaveLength(1);
});

test('renders Chart component', () => {
    const mockTitle = 'Test Chart';
    const mockChartId = 'test-chart-id';
    const mockLabels = ['Label1', 'Label2', 'Label3'];
    const mockDatasets = [
        {
            label: 'Dataset 1',
            data: [10, 20, 30],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }
    ];
    const mockSummary = 'This is a summary';

    render(
        <ChartComponent
            title={mockTitle}
            chartId={mockChartId}
            labels={mockLabels}
            datasets={mockDatasets}
            summary={mockSummary}
        />
    );

    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText(mockSummary)).toBeInTheDocument();
    expect(screen.getByTestId('chart-component')).toBeInTheDocument();
});
