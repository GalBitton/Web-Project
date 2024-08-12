const DeviceSummary = ({ selectedBrand, selectedType }) => (
    <div className="text-center">
        <h2 className="text-xl font-bold">{`Selected Brand: ${selectedBrand}`}</h2>
        <h3 className="text-lg">{`Selected Type: ${selectedType}`}</h3>
    </div>
);

export default DeviceSummary;