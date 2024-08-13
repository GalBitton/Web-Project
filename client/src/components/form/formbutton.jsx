/**
 * Renders a styled button with customizable text and click handler.
 * 
 * @component
 * @name FormButton
 * @param {Object} props - The component props.
 * @param {string} props.text - The text to display on the button.
 * @param {Function} props.onClick - Function to handle the button click event.
 * @param {string} [props.type='button'] - The type of the button (e.g., 'button', 'submit', 'reset').
 * @param {string} [props.className=''] - Additional CSS classes to apply to the button.
 * @returns {React.ReactElement} The rendered component.
 */
const FormButton = ({ text, onClick, type = "button", className = "" }) => (
    <button
        type={type}
        onClick={onClick}
        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 ${className}`}
    >
        {text}
    </button>
);

export default FormButton;
