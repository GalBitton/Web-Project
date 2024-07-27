import React from 'react';

const DeviceCard = ({ device }) => (
    <div className={`relative group m-2 ${device.brand}-${device.type}-container`}>
        <div className="absolute inset-0 flex justify-center items-center">
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-slate-500 text-white px-2 py-1 rounded w-full">{device.name}</span>
            </div>
        </div>
        <img src={device.imageSrc} className="h-36 bg-transparent" alt={device.name} style={{ maxWidth: '100%', maxHeight: '100%' }}/>
        <img
            src={device.imageSrc}
            className="absolute h-36 transform transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-[2] group-hover:z-50 group-hover:top-[20vh]"
            alt={`${device.name} hover`}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
    </div>
);

export default DeviceCard;
