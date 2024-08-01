import axios from 'axios';
import APIService from './APIService';

const endpointAPI = import.meta.env.VITE_ENDPOINT;

const refreshToken = async () => {
    const apiService = new APIService({ action: "refreshToken" });
    await apiService.execute();
};

const forceLogout = async () => {
    const apiService = new APIService({ action: "logout" });
    await apiService.execute();
};

const axiosInstance = axios.create({
    baseURL: endpointAPI,
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    config.headers["Content-Type"] = 'application/json';
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            let retryCount = 0;

            while (retryCount < 3) {
                try {
                    await refreshToken();
                    originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                    return axiosInstance.request(originalRequest);
                } catch (error) {
                    console.log(error);
                    retryCount++;
                }
            }
            await forceLogout();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
