import { GoogleLogin } from '@react-oauth/google';

/**
 * Renders a form with optional Google Login integration and custom handlers.
 * 
 * @component
 * @name Form
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display at the top of the form.
 * @param {Function} props.submitHandler - Function to handle form submission.
 * @param {React.ReactNode} props.children - The content to display inside the form.
 * @param {Function} [props.googleSuccessHandler] - Function to handle Google login success.
 * @param {Function} [props.googleFailureHandler] - Function to handle Google login failure.
 * @param {string} [props.error] - Optional error message to display.
 * @param {string} [props.success] - Optional success message to display.
 * @param {string} [props.secondaryTitle=""] - Optional title for a secondary action link.
 * @param {string} [props.secondaryPath="/"] - Optional path for the secondary action link.
 * @returns {React.ReactElement} The rendered component.
 */
const Form = ({ title, submitHandler, children, googleSuccessHandler, googleFailureHandler, error, success, secondaryTitle = "", secondaryPath = "/" }) => (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-slate-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {title}
                </h2>
                {secondaryTitle !== '' && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Or{' '}
                    <a href={secondaryPath} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        {secondaryTitle}
                    </a>
                </p>}
            </div>
            <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                {children}
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
                {success && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{success}</p>}
                <div className="mt-6 flex items-center justify-center">
                    <GoogleLogin
                        onSuccess={googleSuccessHandler}
                        onFailure={googleFailureHandler}
                        theme="filled_blue"
                        shape="pill"
                    />
                </div>
            </form>
        </div>
    </div>
);

export default Form;
