import axios from 'axios';
import APIService from './APIService';

const endpointAPI = import.meta.env.VITE_ENDPOINT;
let isRefreshing = false;
let pendingRequests = [];

/**
 * Processes the request queue with either an error or a new token.
 *
 * @param {Error|null} error - The error to reject requests with, or null to resolve with a token.
 * @param {string|null} token - The new token to resolve requests with, or null if there's an error.
 */
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

/**
 * Refreshes the authentication token.
 *
 * @param {number} [retryCount=0] - The number of times the refresh token attempt has been retried.
 * @returns {Promise<boolean>} True if the token was successfully refreshed, false otherwise.
 */
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

/**
 * Forces the user to logout.
 *
 * @returns {Promise<void>}
 */
const forceLogout = async () => {
    const apiService = new APIService({ action: "logout" });
    await apiService.execute();
};

const axiosInstance = axios.create({
    baseURL: endpointAPI,
    withCredentials: true
});

/**
 * Axios request interceptor to add the Authorization header.
 *
 * @param {Object} config - The request configuration object.
 * @returns {Object} The modified request configuration object.
 */
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    config.headers["Content-Type"] = 'application/json';
    return config;
}, (error) => Promise.reject(error));

/**
 * Axios response interceptor to handle token refresh on 401 errors.
 *
 * @param {Object} response - The Axios response object.
 * @returns {Object} The Axios response object or a rejected promise with an error.
 */
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
