import React, { useEffect } from 'react';
import APIService from '../services/api/APIService.js';

const useAPIService = (request) => {
    const [data, setData] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchData = async () => {
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
        fetchData();
    }, []);

    return { data, error, loading };
};

export default useAPIService;
