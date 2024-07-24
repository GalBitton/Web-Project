import axios from 'axios';
import React, { createContext, useContext } from 'react';
import APIService from '../services/api/APIService';

const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
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
            if (error.response.status === 401 || error.response.status === 403) {
                let retryCount = 0;

                while (retryCount < 3) {
                    try {
                        await refreshToken();
                        return axiosInstance.request(error.config);
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

    return (
        <AxiosContext.Provider value={axiosInstance}>
            {children}
        </AxiosContext.Provider>
    );
};

export const useAxios = () => {
    return useContext(AxiosContext);
};
