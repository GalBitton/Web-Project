import { useState } from 'react';
import DeviceCard from '@/components/cards/devicecard';
import { Carousel } from 'react-responsive-carousel';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

/**
 * Displays a list of linked devices in a carousel format and provides functionality to link new devices.
 * 
 * @component
 * @name DeviceList
 * @param {Object} props - The component props.
 * @param {Array<Object>} [props.linkedDevices=[]] - The list of linked devices to display.
 * @param {number} props.selectedItem - The index of the currently selected item in the carousel.
 * @param {Function} props.setSelectedItem - Function to set the selected item index in the carousel.
 * @param {Function} props.handleLinkDevice - Function to handle linking a new device.
 * @param {Array<Object>} [props.unlinkedDevices=[]] - The list of unlinked devices available for linking.
 * @returns {React.ReactElement} The rendered component.
 */
const DeviceList = ({ linkedDevices = [], selectedItem, setSelectedItem, handleLinkDevice, unlinkedDevices = [] }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDeviceToLink, setSelectedDeviceToLink] = useState('');

    /**
     * Toggles the visibility of the device linking options.
     */
    const handlePlusClick = () => {
        setIsVisible(!isVisible);
    };

    /**
     * Updates the selected device to link based on the user's selection.
     * 
     * @param {Event} event - The change event from the select element.
     */
    const handleDeviceLinkChange = (event) => {
        const selectedDevice = event.target.value;
        setSelectedDeviceToLink(selectedDevice);
    };

    return (
        <div className="flex-container flex-wrap bg-gray-100 dark:bg-slate-900 ml-4 mr-4 rounded-lg shadow-lg pb-5 mb-4">
            <div className="relative flex justify-center items-center">
                <div className='flex items-center mb-4'>
                    <h1 className="text-3xl text-black dark:text-white mt-8">Linked Devices</h1>
                </div>

                <div className={`flex absolute right-0 transition-opacity duration-250 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex mr-24 absolute right-0 ">
                        <div>
                            <button
                                className="unlink mr-1 bg-green-600 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-400 text-white dark:text-black px-4 py-2 rounded-lg w-full sm:w-[8rem]"
                                onClick={async () => {
                                    const model = selectedDeviceToLink.split("-");
                                    await handleLinkDevice(model[0], model[1]);
                                }}>Link
                            </button>
                        </div>
                        <div>
                            <select
                                className="brandCmbBox bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded-lg w-full sm:w-[10rem] min-w-[10rem]"
                                value={selectedDeviceToLink} onChange={handleDeviceLinkChange}>
                                <option selected>Choose Device</option>
                                {Array.isArray(unlinkedDevices) && unlinkedDevices.map((device, index) => (
                                    <option key={index} value={`${device.brand}-${device.type}`}>{device.brand + " " + device.type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div
                    className="unlink bg-green-600 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-400 text-white dark:text-black rounded-full w-[3rem] h-[3rem] flex items-center justify-center absolute right-0 mt-10 mr-10 transform transition-transform duration-300 hover:rotate-90">
                    <div className="absolute inset-0 z-[-1] rounded-full opacity-40 bg-gradient-to-r from-green-400 to-green-600 blur-md"></div>
                    <button onClick={handlePlusClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex-1 justify-center p-4 lg:mb-0">
                <div className="linked-devices flex justify-center items-center p-2">
                    <div className="w-full flex flex-col items-center">
                        <Carousel
                            selectedItem={selectedItem}
                            showThumbs={false}
                            showIndicators={false}
                            showStatus={false}
                            infiniteLoop={true}
                            centerMode={true}
                            swipeable={true}
                            className="flex flex-col items-center w-full"
                            onChange={(index) => setSelectedItem(index)}
                            renderArrowPrev={(clickHandler, hasPrev) =>
                                hasPrev && (
                                    <button
                                        type="button"
                                        onClick={clickHandler}
                                        className="absolute left-0 z-10 p-2 transform -translate-y-1/2 top-1/2 text-black dark:text-white"
                                    >
                                        <FaArrowLeft size={30} />
                                    </button>
                                )
                            }
                            renderArrowNext={(clickHandler, hasNext) =>
                                hasNext && (
                                    <button
                                        type="button"
                                        onClick={clickHandler}
                                        className="absolute right-0 z-10 p-2 transform -translate-y-1/2 top-1/2 text-black dark:text-white"
                                    >
                                        <FaArrowRight size={30} />
                                    </button>
                                )
                            }
                        >
                            {Array.isArray(linkedDevices) && linkedDevices.length > 0 ? linkedDevices.map((device) => (
                                <div key={device.name} className="flex flex-col items-center">
                                    <div className="flex justify-center">
                                        <DeviceCard device={device}/>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex justify-center">
                                    <p>No devices linked yet. Please link a device.</p>
                                </div>
                            )}
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceList;