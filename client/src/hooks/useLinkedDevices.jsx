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


    /**
     * useEffect hook to fetch and initialize linked devices data.
     * Updates linked and unlinked devices states based on provided device data.
     */
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

    /**
     * Creates an array of linked device objects, each with additional metadata.
     *
     * @param {Array} devices - Array of device objects to create linked devices.
     * @returns {Promise<Array>} - A promise that resolves to an array of linked devices.
     */
    const createAllDevices = async (devices) => {
        return Promise.all(devices.map(async (device) => ({
            ...device,
            name: `${device.brand} ${device.type}`,
            imageSrc: '/assets/devices/' + device.brand.toLowerCase() + '-' + device.type.toLowerCase() + '.png',
            device: new Device(device._id),
        })));
    };

    /**
     * Updates the state of unlinked devices based on the current linked devices.
     *
     * @param {Array} linkedDevices - Array of currently linked devices.
     */
    const updateAvailableDevices = (linkedDevices) => {
        const availableDevices = supportedDevices.filter(device =>
            !linkedDevices.some(linked => linked.brand === device.brand && linked.type === device.type)
        );
        setUnlinkedDevices(availableDevices);
    };

    /**
     * Links a new device by brand and type, and updates relevant states and UI elements.
     *
     * @param {string} brand - The brand of the device to link.
     * @param {string} type - The type of the device to link.
     */
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

    /**
     * Unlinks a device by its ID, and updates relevant states and UI elements.
     *
     * @param {string} deviceId - The ID of the device to unlink.
     */
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
