import { useEffect, useState } from 'react';
import APIService from '../services/api/APIService.js';

/**
 * Custom hook for managing API service requests.
 * 
 * @param {Object} request - The request configuration for the API service.
 * @param {string} request.action - The action to be performed by the API service.
 * @param {Object} [request.params] - Optional parameters for the API request.
 * 
 * @returns {Object} The hook's state.
 * @returns {any} data - The data retrieved from the API request.
 * @returns {Error|null} error - Any error that occurred during the API request.
 * @returns {boolean} loading - Whether the API request is in progress.
 */
const useAPIService = (request, dependencies = []) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiService = new APIService(request);
            const response = await apiService.execute();
            setData(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [...dependencies]);

    return { data, error, loading, refetch: fetchData };
};

export default useAPIService;
