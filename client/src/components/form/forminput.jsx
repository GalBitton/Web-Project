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
