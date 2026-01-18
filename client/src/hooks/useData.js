import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { useDataEngine } from '../context/DataContext';

/**
 * useData: Stale-While-Revalidate fetching hook.
 * @param {string} endpoint - The API endpoint to fetch.
 * @param {object} options - Configuration options.
 * @param {number} options.staleTime - How long (ms) data is considered fresh. Default: 5 minutes.
 */
export const useData = (endpoint, { staleTime = 300000 } = {}) => {
    const { getCache, setCache, cacheVersion } = useDataEngine();

    // Internal state for the UI
    const [state, setState] = useState({
        data: getCache(endpoint)?.data || null,
        loading: !getCache(endpoint),
        error: null,
    });

    const fetchData = useCallback(async (isManual = false) => {
        if (!isManual) {
            setState(prev => ({ ...prev, loading: true, data: null }));
        }

        try {
            const data = await apiClient(endpoint);
            setCache(endpoint, data);
            setState({ data, loading: false, error: null });
        } catch (err) {
            setState(prev => ({ ...prev, loading: false, error: err }));
        }
    }, [endpoint, setCache]);

    useEffect(() => {
        const cached = getCache(endpoint);
        const now = Date.now();

        // 1. If we have NO data, fetch immediately
        if (!cached) {
            fetchData();
        }
        // 2. If data is STALE, revalidate in background (SWR)
        else if (now - cached.timestamp > staleTime) {
            fetchData(true); // True means background fetch (stale data exists)
        }
        // 3. If data exists in state but cache version changed (external invalidation)
        // we sync the state
        else if (cached.data !== state.data) {
            setState(prev => ({ ...prev, data: cached.data }));
        }

    }, [endpoint, getCache, fetchData, cacheVersion, state.data, staleTime]);

    return {
        ...state,
        refresh: () => fetchData(false) // Manual refresh
    };
};

/**
 * useDataMutations: Standard hook for creating, updating, and deleting data.
 * Automates loading states, error handling, and cache invalidation.
 * @param {string} endpoint - The API endpoint family (e.g., '/data/types').
 */
export const useDataMutations = (endpoint) => {
    const { invalidate } = useDataEngine();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * mutate: Generic wrapper for API mutations.
     * @param {string} method - HTTP Method (POST, PUT, DELETE).
     * @param {object} body - JSON payload.
     * @param {string} suffix - Optional URL suffix (e.g., '/:id').
     */
    const mutate = async (method, body = null, suffix = '') => {
        setLoading(true);
        setError(null);
        try {
            const url = suffix ? `${endpoint}${suffix}` : endpoint;
            const response = await apiClient(url, { method, body });

            // On success, invalidate the cache for this endpoint family
            invalidate(endpoint);

            return { success: true, data: response };
        } catch (err) {
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return {
        /** Create a new record */
        create: (body) => mutate('POST', body),
        /** Update an existing record by ID */
        update: (id, body) => mutate('PUT', body, `/${id}`),
        /** Delete a record by ID */
        delete: (id) => mutate('DELETE', null, `/${id}`),
        loading,
        error
    };
};
