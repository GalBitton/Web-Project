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
