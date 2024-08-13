/**
 * Renders an input field or textarea with a label.
 * 
 * @component
 * @name InputField
 * @param {Object} props - The component props.
 * @param {string} props.label - The label text for the input field.
 * @param {string} props.id - The unique identifier for the input field.
 * @param {string} [props.type='text'] - The type of the input field. Can be 'text' or 'textarea'.
 * @param {string} props.value - The current value of the input field.
 * @param {Function} props.onChange - Function to handle changes to the input field.
 * @param {string} [props.placeholder] - The placeholder text for the input field.
 * @returns {React.ReactElement} The rendered component.
 */
const InputField = ({ label, id, type = 'text', value, onChange, placeholder }) => {
    const classes = 'mt-2 p-3 w-full border rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600';
    return (
        <div>
            <label htmlFor={id} className="block text-lg text-gray-700 dark:text-gray-300">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    className={classes}
                    placeholder={placeholder}
                    value={value}
                    rows={6}
                    onChange={onChange}
                />
            ) : (
                <input
                    id={id}
                    className={classes}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
}

export default InputField;
