import { useState, useEffect } from 'react';
import APIService from '@/services/api/APIService';
import Device from '@/services/device.js'; // Import the Device class

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
                              selectedItem // Pass selectedItem as a prop
                          }) => {
    const [linkedDevices, setInternalLinkedDevices] = useState([]);

    useEffect(() => {
        const getDevicesData = async () => {
            if (devicesData) {
                const linkedDevices = await createAllDevices();
                setInternalLinkedDevices(linkedDevices);
                setLinkedDevices(linkedDevices); // Update the external linkedDevices state as well
                const availableDevices = supportedDevices.filter(device =>
                    !linkedDevices.some(linked => linked.brand === device.brand && linked.type === device.type)
                );
                setUnlinkedDevices(availableDevices);
            }
        };

        getDevicesData();
    }, [devicesData]);

    const createAllDevices = async () => {
        if (devicesData) {
            return Promise.all(devicesData.map(async (device) => ({
                ...device,
                name: `${device.brand} ${device.type}`,
                imageSrc: '/assets/watches/' + device.brand.toLowerCase() + '-' + device.type.toLowerCase() + '.png',
                device: new Device(device._id),
            })));
        }
        return [];
    };

    const handleLinkDevice = async (brand, type) => {
        const apiService = new APIService({ action: 'linkDevice', brand, type });
        console.log('Linking device:', brand, type);
        const newDevice = await apiService.execute();
        console.log('New device:', newDevice);
        if (newDevice) {
            const updatedLinkedDevices = [...linkedDevices, {
                brand: newDevice.brand,
                type: newDevice.type,
                name: `${newDevice.brand} ${newDevice.type}`,
                imageSrc: '/assets/watches/' + newDevice.brand.toLowerCase() + '-' + newDevice.type.toLowerCase() + '.png',
                device: new Device(newDevice._id),
                status: 'linked'
            }];
            setLinkedDevices(updatedLinkedDevices);

            const availableDevices = supportedDevices.filter(device =>
                !updatedLinkedDevices.some(linked => linked.brand === device.brand && linked.type === device.type)
            );
            setUnlinkedDevices(availableDevices);

            // Update selected item and brand/type for UI consistency
            setSelectedItem(updatedLinkedDevices.length - 1);
            setSelectedBrand(newDevice.brand);
            setSelectedType(newDevice.type);
            setCurrentDevice(updatedLinkedDevices[updatedLinkedDevices.length - 1].device);
            updateCharts(updatedLinkedDevices[updatedLinkedDevices.length - 1].device); // Update charts with new device
        }
    };

    const handleUnlinkDevice = async (deviceId) => {
        try {
            const apiService = new APIService({ action: 'unlinkDevice', deviceId });
            await apiService.execute();

            const updatedLinkedDevices = linkedDevices.filter(device => device.device.id !== deviceId);
            setInternalLinkedDevices(updatedLinkedDevices);
            setLinkedDevices(updatedLinkedDevices);

            if (updatedLinkedDevices.length > 0) {
                const selectedDevice = updatedLinkedDevices[0];
                setSelectedItem(0);
                setSelectedBrand(selectedDevice.brand);
                setSelectedType(selectedDevice.type);
                setCurrentDevice(selectedDevice.device);
                updateCharts(selectedDevice.device); // Update charts with the new current device
            } else {
                setSelectedItem(0);
                setSelectedBrand('');
                setSelectedType('');
                setCurrentDevice(null);
                updateCharts(null); // Clear the charts as no device is selected
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