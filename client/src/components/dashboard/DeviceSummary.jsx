/**
 * Displays the selected brand and type.
 * 
 * @function
 * @name DeviceSummary
 * @param {Object} props - The component props.
 * @param {string} props.selectedBrand - The selected brand.
 * @param {string} props.selectedType - The selected type.
 * @returns {React.ReactElement} The rendered component.
 */
const DeviceSummary = ({ selectedBrand, selectedType }) => (
    <div className="text-center">
        <h2 className="text-xl font-bold">{`Selected Brand: ${selectedBrand}`}</h2>
        <h3 className="text-lg">{`Selected Type: ${selectedType}`}</h3>
    </div>
);

export default DeviceSummary;