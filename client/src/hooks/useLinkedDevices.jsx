import { useState, useEffect } from 'react';
import APIService from '@/services/api/APIService';
import Device from '@/services/device.js'; // Import the Device class

/**
 * Custom hook to manage linked devices, including linking and unlinking devices.
 *
 * @param {Object} params - Parameters for the hook.
 * @param {Array} params.devicesData - Array of device data to initialize linked devices.
 * @param {Array} params.supportedDevices - Array of supported devices to determine unlinked devices.
 * @param {Function} params.setLinkedDevices - Function to update the state of linked devices.
 * @param {Function} params.setUnlinkedDevices - Function to update the state of unlinked devices.
 * @param {Function} params.setSelectedItem - Function to update the selected item index.
 * @param {Function} params.setSelectedBrand - Function to update the selected brand.
 * @param {Function} params.setSelectedType - Function to update the selected type.
 * @param {Function} params.setCurrentDevice - Function to update the current device.
 * @param {Function} params.updateCharts - Function to update charts with the new device.
 *
 * @returns {Object} - Contains methods to link and unlink devices.
 * @returns {Function} handleLinkDevice - Function to link a device by brand and type.
 * @returns {Function} handleUnlinkDevice - Function to unlink a device by its ID.
 */
const useLinkedDevices = ({
                              devicesData,
                              supportedDevices,
                              setLinkedDevices,
                              setUnlinkedDevices,
                              setSelectedItem,
                              setSelectedBrand,
                              setSelectedType,
                              setCurrentDevice,
                              updateCharts,
                          }) => {
    const [internalLinkedDevices, setInternalLinkedDevices] = useState([]);

    useEffect(() => {
        const getDevicesData = async () => {
            if (devicesData) {
                const linkedDevices = await createAllDevices(devicesData);
                setInternalLinkedDevices(linkedDevices);
                setLinkedDevices(linkedDevices);
                updateAvailableDevices(linkedDevices);
            }
        };

        getDevicesData();
    }, [devicesData]);

    const createAllDevices = async (devices) => {
        return Promise.all(devices.map(async (device) => ({
            ...device,
            name: `${device.brand} ${device.type}`,
            imageSrc: '/assets/devices/' + device.brand.toLowerCase() + '-' + device.type.toLowerCase() + '.png',
            device: new Device(device._id),
        })));
    };

    const updateAvailableDevices = (linkedDevices) => {
        const availableDevices = supportedDevices.filter(device =>
            !linkedDevices.some(linked => linked.brand === device.brand && linked.type === device.type)
        );
        setUnlinkedDevices(availableDevices);
    };

    const handleLinkDevice = async (brand, type) => {
        const apiService = new APIService({ action: 'linkDevice', brand, type });
        const newDevice = await apiService.execute();

        if (newDevice) {
            const updatedLinkedDevices = [...internalLinkedDevices, {
                brand: newDevice.brand,
                type: newDevice.type,
                name: `${newDevice.brand} ${newDevice.type}`,
                imageSrc: '/assets/devices/' + newDevice.brand.toLowerCase() + '-' + newDevice.type.toLowerCase() + '.png',
                device: new Device(newDevice._id),
                status: 'linked'
            }];
            setInternalLinkedDevices(updatedLinkedDevices);
            setLinkedDevices(updatedLinkedDevices);
            updateAvailableDevices(updatedLinkedDevices);

            // Update UI elements
            setSelectedItem(updatedLinkedDevices.length - 1);
            setSelectedBrand(newDevice.brand);
            setSelectedType(newDevice.type);
            setCurrentDevice(updatedLinkedDevices[updatedLinkedDevices.length - 1].device);
            updateCharts(updatedLinkedDevices[updatedLinkedDevices.length - 1].device);
        }
    };

    const handleUnlinkDevice = async (deviceId) => {
        try {
            const apiService = new APIService({ action: 'unlinkDevice', deviceId });
            await apiService.execute();

            const updatedLinkedDevices = internalLinkedDevices.filter(device => device.device.id !== deviceId);
            setInternalLinkedDevices(updatedLinkedDevices);
            setLinkedDevices(updatedLinkedDevices);
            updateAvailableDevices(updatedLinkedDevices);

            if (updatedLinkedDevices.length > 0) {
                const selectedDevice = updatedLinkedDevices[0];
                setSelectedItem(0);
                setSelectedBrand(selectedDevice.brand);
                setSelectedType(selectedDevice.type);
                setCurrentDevice(selectedDevice.device);
                updateCharts(selectedDevice.device);
            } else {
                setSelectedItem(0);
                setSelectedBrand('');
                setSelectedType('');
                setCurrentDevice(null);
                updateCharts(null);
            }
        } catch (error) {
            console.error('Error unlinking device:', error);
        }
    };

    return {
        handleLinkDevice,
        handleUnlinkDevice,
    };
};

export default useLinkedDevices;
