import { useState } from 'react';
import useNavigate from "@/hooks/useNavigate";
import Form from "@/components/form/form";
import FormInput from "@/components/form/forminput";
import FormButton from "@/components/form/formbutton";

import APIService from "@/services/api/APIService";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { navigate } = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const apiService = new APIService( { action: 'register', email, password });
            const response = await apiService.execute();
            if (response && response.error) {
                setError(response.error);
                setSuccess('');
            } else {
                setError(''); // Clear any previous error
                setSuccess('Registration successful, redirecting to login page...');
                navigate({ redirectPath: '/login', redirectTimeout: 3 });
            }
        } catch (error) {
            setError('Registration failed');
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
        console.error('Google Registration Failed:', error);
        setError('Google registration failed');
    };

    return (
        <Form
            title="Create a new account"
            submitHandler={handleSubmit}
            googleSuccessHandler={handleGoogleSuccess}
            googleFailureHandler={handleGoogleFailure}
            error={error}
            success={success}
            secondaryTitle={'sign in to your account'}
            secondaryPath={'/login'}
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
            <FormInput
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FormButton type="submit" text="Sign up" />
        </Form>
    );
};

export default Register;
