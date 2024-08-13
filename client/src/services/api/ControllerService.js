import axiosInstance from "@/services/api/AxiosHandler.js";
const endpointAPI = import.meta.env.VITE_ENDPOINT;

/**
 * Provides methods to interact with authentication and user data endpoints.
 *
 * @returns {Object} The service methods.
 */
export const ControllerService = () => {
    /**
     * Logs in a user with email and password.
     *
     * @param {string} email - The email address of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<Object>} The response data or an error message.
     */
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

            // Dispatch custom event after updating localStorage
            const event = new Event('authChange');
            window.dispatchEvent(event);
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

    /**
     * Logs in a user using Google authentication.
     *
     * @param {string} idToken - The Google ID token.
     * @returns {Promise<Object>} The response data or an error message.
     */
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
            localStorage.setItem('googleToken', idToken);

            // Dispatch custom event after updating localStorage
            const event = new Event('authChange');
            window.dispatchEvent(event);
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

    /**
     * Registers a new user with email and password.
     *
     * @param {string} email - The email address of the new user.
     * @param {string} password - The password of the new user.
     * @returns {Promise<Object>} The response data or an error message.
     */
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

    /**
     * Logs out the user and revokes the Google token if present.
     *
     * @returns {Promise<void>}
     */
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

            // Dispatch custom event after updating localStorage
            const event = new Event('authChange');
            window.dispatchEvent(event);
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

    /**
     * Refreshes the authentication token.
     *
     * @returns {Promise<void>} Resolves when the token is successfully refreshed.
     * @throws {Error} If the token refresh fails.
     */
    const refreshToken = async () => {
        // It's critical that we use regular fetch here instead of axiosInstance to avoid infinite loops
        const response = await fetch(`${endpointAPI}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
    };

    /**
     * Retrieves the list of linked devices for the user.
     *
     * @returns {Promise<Object>} The list of linked devices.
     */
    const getLinkedDevices = async () => {
        const response = await axiosInstance.get(`${endpointAPI}/user/linked-devices`);
        return response.data;
    };

    /**
     * Retrieves the average data for all linked devices.
     *
     * @returns {Promise<Object>} The average data for all devices.
     */
    const getAverageDataAllDevices = async () => {
        const response = await axiosInstance.get(`${endpointAPI}/user/average-devices-data`);
        return response.data;
    };

    /**
     * Retrieves data for a specific device.
     *
     * @param {string} deviceId - The ID of the device.
     * @returns {Promise<Object>} The data for the specified device.
     */
    const getDeviceData = async (deviceId) => {
        const response = await axiosInstance.get(`${endpointAPI}/user/device-data/${deviceId}`);
        return response.data;
    };

    /**
     * Links a new device to the user account.
     *
     * @param {string} brand - The brand of the device.
     * @param {string} type - The type of the device.
     * @returns {Promise<Object>} The linked device data.
     */
    const linkDevice = async (brand, type) => {
        const response = await axiosInstance.post(`${endpointAPI}/user/link-device`, {
            brand,
            type
        });
        return response.data.device;
    };

    /**
     * Unlinks a device from the user account.
     *
     * @param {string} deviceId - The ID of the device to unlink.
     * @returns {Promise<Object>} The result of the unlink operation.
     */
    const unlinkDevice = async (deviceId) => {
        const response = await axiosInstance.post(`${endpointAPI}/user/unlink-device/${deviceId}`);
        return response.data;
    };

    /**
     * Retrieves the user's health story.
     *
     * @returns {Promise<Object>} The user's health story data.
     */
    const getHealthStory = async () => {
        const response = await axiosInstance.get(`${endpointAPI}/user/health-story`);
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
        getDeviceData,
        linkDevice,
        unlinkDevice,
        getHealthStory
    };
};
