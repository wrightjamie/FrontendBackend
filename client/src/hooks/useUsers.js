import { useState } from 'react';
import { useData } from './useData';
import apiClient from '../api/apiClient';

/**
 * useUsers: Hook for fetching all users
 */
export const useUsers = () => {
    return useData('/users');
};

/**
 * usePendingCount: Hook for fetching pending user count
 */
export const usePendingCount = () => {
    return useData('/users/pending-count');
};

/**
 * useUserMutations: CRUD operations for user management
 */
export const useUserMutations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = async (method, endpoint, body = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient(endpoint, { method, body });
            return { success: true, data: response };
        } catch (err) {
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUser: (id, data) => mutate('PUT', `/users/${id}`, data),
        approveUser: (id) => mutate('PUT', `/users/${id}/approve`),
        resetPassword: (id, password) => mutate('PUT', `/users/${id}/password`, { password }),
        deleteUser: (id) => mutate('DELETE', `/users/${id}`),
        loading,
        error
    };
};
