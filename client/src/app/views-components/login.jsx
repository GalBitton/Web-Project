import { useState } from 'react';
import useNavigate from "@/hooks/useNavigate";
import Form from "@/components/form/form";
import FormInput from "@/components/form/forminput";
import FormButton from "@/components/form/formbutton";
import APIService from "@/services/api/APIService";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { navigate } = useNavigate();

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

    const handleGoogleFailure = (error) => {
        console.error('Google Login Failed:', error);
        setError('Google login failed');
    };

    return (
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
    );
};

export default Login;
