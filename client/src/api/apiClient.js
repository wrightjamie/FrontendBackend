/**
 * Standard API Client for the project template.
 * Handles base configuration, JSON parsing, and central error handling.
 */
const BASE_URL = '/api';

const apiClient = async (endpoint, options = {}) => {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // Handle non-JSON responses (like 204 No Content)
        const contentType = response.headers.get('content-type');
        const data = contentType && contentType.includes('application/json')
            ? await response.json()
            : null;

        if (!response.ok) {
            const error = new Error(data?.message || `HTTP Error: ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        console.error(`API Error [${endpoint}]:`, err.message);
        throw err;
    }
};

export default apiClient;
