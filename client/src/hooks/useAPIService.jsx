import React from 'react';
import { useAxios } from '../contexts/APIContext.jsx';
import APIService from '../services/api/APIService.js';

const useAPIService = (request) => {
    const axiosInstance = useAxios();

    return new APIService(request, axiosInstance);
};

export default useAPIService;
