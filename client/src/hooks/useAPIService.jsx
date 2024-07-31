import { useEffect, useState } from 'react';
import APIService from '../services/api/APIService.js';

const useAPIService = (request) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
