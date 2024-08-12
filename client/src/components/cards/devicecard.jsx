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
