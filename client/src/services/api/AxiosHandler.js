import axios from 'axios';
import APIService from './APIService';

const endpointAPI = import.meta.env.VITE_ENDPOINT;
let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
    pendingRequests.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    pendingRequests = [];
};

const refreshToken = async (retryCount = 0) => {
    isRefreshing = true;
    try {
        const apiService = new APIService({ action: "refreshToken" });
        await apiService.execute();
        isRefreshing = false;
        processQueue(null, localStorage.getItem('token'));
        return true;
    } catch (err) {
        if (retryCount < 3) {
            return await refreshToken(retryCount + 1);
        } else {
            isRefreshing = false;
            await forceLogout();
            return false;
        }
    }

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

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            const hasRefreshedToken = await refreshToken();

            if (hasRefreshedToken) {
                const newToken = localStorage.getItem('token');
                if (newToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return axiosInstance.request(originalRequest);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
