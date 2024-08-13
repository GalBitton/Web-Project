/**
 * DeviceCard component displays a card for a device with an image and a hover effect to show the device's name.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.device - The device information to display.
 * @param {string} props.device.brand - The brand of the device.
 * @param {string} props.device.type - The type of the device.
 * @param {string} props.device.name - The name of the device.
 * @param {string} props.device.imageSrc - The source URL for the device's image.
 * @returns {JSX.Element} The rendered DeviceCard component.
 */
const DeviceCard = ({ device }) => (
    <div className={`relative group m-2 ${device.brand}-${device.type}-container`}>
        <div className="absolute inset-0 flex justify-center items-center">
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-slate-500 text-white px-2 py-1 rounded w-full">{device.name}</span>
            </div>
        </div>
        <img 
            src={device.imageSrc} 
            className="w-full h-auto max-w-[12rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-[18rem] bg-transparent" 
            alt={device.name} 
            style={{ maxHeight: '100%' }}
        />
        
    </div>
);

export default DeviceCard;
