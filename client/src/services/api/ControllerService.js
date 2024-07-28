import axiosInstance from "@/services/api/AxiosHandler.js";
const endpointAPI = import.meta.env.VITE_ENDPOINT;

export const ControllerService = () => {
    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post(`${endpointAPI}/auth/authenticate`, {
                email: email,
                password: password,
            });

            localStorage.setItem('identity', JSON.stringify({
                userId: response.data.userId,
                email: response.data.email
            }));
            localStorage.setItem('token', response.data.accessToken);
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    message: "Something went wrong"
                };
            }
        }
    };

    const loginGoogle = async (idToken) => {
        try {
            const response = await axiosInstance.post(`${endpointAPI}/auth/authenticate-google`, {
                idToken: idToken,
            });

            localStorage.setItem('identity', JSON.stringify({
                userId: response.data.userId,
                email: response.data.email
            }));
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('googleToken', response.data.googleToken);
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    message: "Something went wrong"
                };
            }
        }
    };

    const register = async (email, password) => {
        try {
            const response = await axiosInstance.post(`${endpointAPI}/auth/register`, {
                email: email,
                password: password,
            });

            localStorage.setItem('identity', JSON.stringify({
                userId: response.data.userId,
                email: response.data.email
            }));
            localStorage.setItem('token', response.data.accessToken);
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    message: "Something went wrong"
                };
            }
        }
    };

    const logout = async () => {
        try {
            const googleToken = localStorage.getItem('googleToken');
            await axiosInstance.post(`${endpointAPI}/auth/logout`);

            if (googleToken && typeof window !== 'undefined') {
                axiosInstance.defaults.headers.common = {};
                window.google?.accounts.id.revoke(googleToken, () => {
                    return {};
                });
                localStorage.removeItem('googleToken');
            }

            localStorage.removeItem('token');
            window.location.replace("/login");
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return {
                    message: "Something went wrong"
                };
            }
        }
    };

    const refreshToken = async () => {
        const response = await axiosInstance.post(`${endpointAPI}/auth/refresh`);
        localStorage.setItem('token', response.data.token);
    };

    const getLinkedDevices = async () => {
        const response = await axiosInstance.get(`${endpointAPI}/user/linked-devices`);
        return response.data;
    };

    const getAverageDataAllDevices = async () => {
        const response = await axiosInstance.get(`${endpointAPI}/user/average-devices-data`);
        return response.data;
    };

    const getDeviceData = async (deviceId) => {
        const response = await axiosInstance.get(`${endpointAPI}/user/device-data/${deviceId}`);
        return response.data;
    };

    return {
        login,
        loginGoogle,
        register,
        logout,
        refreshToken,
        getLinkedDevices,
        getAverageDataAllDevices,
        getDeviceData
    };
};
