import axiosInstance from "@/services/api/AxiosHandler.js";
const endpointAPI = import.meta.env.VITE_ENDPOINT;

export const ControllerService = () => {
    const logout = async () => {
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
        logout,
        refreshToken,
        getLinkedDevices,
        getAverageDataAllDevices,
        getDeviceData,
    };
};
