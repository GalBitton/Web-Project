/**
 * Renders a styled input field with label and placeholder.
 * 
 * @component
 * @name FormInput
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier for the input field.
 * @param {string} props.name - The name attribute for the input field.
 * @param {string} [props.type='text'] - The type of the input field (e.g., 'text', 'password', etc.).
 * @param {string} props.value - The current value of the input field.
 * @param {Function} props.onChange - Function to handle changes to the input field.
 * @param {string} [props.placeholder] - The placeholder text for the input field.
 * @param {boolean} [props.required=true] - Whether the input field is required.
 * @returns {React.ReactElement} The rendered component.
 */
const FormInput = ({ id, name, type = "text", value, onChange, placeholder, required = true }) => (
    <div>
        <label htmlFor={id} className="sr-only">
            {placeholder}
        </label>
        <input
            id={id}
            name={name}
            type={type}
            required={required}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

export default FormInput;
