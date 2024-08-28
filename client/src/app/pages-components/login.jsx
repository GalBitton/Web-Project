import { useState } from 'react';
import useNavigate from "@/hooks/useNavigate";
import Form from "@/components/form/form";
import FormInput from "@/components/form/forminput";
import FormButton from "@/components/form/formbutton";
import APIService from "@/services/api/APIService";

/**
 * Login component for user authentication.
 * 
 * Provides a form for users to log in with their email and password, or using Google authentication.
 * Handles form submission and Google authentication success/failure.
 * 
 * @component
 * @example
 * return (
 *   <Login />
 * );
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { navigate } = useNavigate();

    /**
     * Handles form submission for email/password login.
     * 
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const apiService = new APIService({ action: 'login', email, password });
            const response = await apiService.execute();
            if (response && response.error) {
                setError(response.error);
            } else {
                setError(''); // Clear any previous error
                navigate({ redirectPath: '/dashboard', redirectTimeout: 0 });
            }
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    /**
     * Handles successful Google authentication.
     * 
     * @param {Object} response - The Google authentication response.
     * @param {string} response.credential - The Google ID token.
     * @returns {Promise<void>}
     */
    const handleGoogleSuccess = async (response) => {
        const apiService = new APIService({ action: 'login-google', idToken: response.credential });
        const res = await apiService.execute();
        if (res && res.error) {
            handleGoogleFailure(res.error);
        } else {
            setError(''); // Clear any previous error
            navigate({ redirectPath: '/dashboard', redirectTimeout: 0 });
        }
    };

    /**
     * Handles failure of Google authentication.
     * 
     * @param {string} error - The error message from the Google authentication failure.
     */
    const handleGoogleFailure = (error) => {
        console.error('Google Login Failed:', error);
        setError('Google login failed');
    };

    return (
        <div className="mr-4 ml-4 pt-24 h-full">
        <Form
            title="Sign in to your account"
            submitHandler={handleSubmit}
            googleSuccessHandler={handleGoogleSuccess}
            googleFailureHandler={handleGoogleFailure}
            error={error}
            secondaryTitle="Don't have an account? Sign up"
            secondaryPath="/register"
        >
            <FormInput
                id="email-address"
                name="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <FormButton type="submit" text="Sign in" />
        </Form>
        </div>
    );
};

export default Login;
