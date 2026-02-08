import { renderHook, waitFor, act } from '@testing-library/react';
/**
 * @file useData.test.js
 * @description Unit tests for the useData and useDataMutations hooks.
 * 
 * @tests
 * 1. Fetches data on mount if cache is empty.
 * 2. Returns cached data immediately if available.
 * 3. Revalidates data in background if cache is stale.
 * 4. Handles API errors gracefully.
 * 5. perform mutations (POST, PUT, DELETE) via useDataMutations.
 * 6. Invalidates cache after successful mutation.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { useData, useDataMutations } from './useData';
import * as DataContextExports from '../context/DataContext';
import apiClient from '../api/apiClient';

// Mock dependencies
vi.mock('../context/DataContext', () => ({
    useDataEngine: vi.fn()
}));

vi.mock('../api/apiClient', () => ({
    default: vi.fn()
}));

describe('useData Hook', () => {
    const mockGetCache = vi.fn();
    const mockSetCache = vi.fn();
    const mockInvalidate = vi.fn();

    beforeEach(() => {
        // Setup default DataContext mock
        DataContextExports.useDataEngine.mockReturnValue({
            getCache: mockGetCache,
            setCache: mockSetCache,
            invalidate: mockInvalidate,
            cacheVersion: 1
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('fetches data on mount if cache is empty', async () => {
        mockGetCache.mockReturnValue(null);
        apiClient.mockResolvedValue({ id: 1, name: 'Test' });

        const { result } = renderHook(() => useData('/test'));

        // Should start loading
        expect(result.current.loading).toBe(true);
        expect(result.current.data).toBeNull();

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual({ id: 1, name: 'Test' });
        expect(apiClient).toHaveBeenCalledWith('/test');
    });

    it('returns cached data immediately', async () => {
        // Use a timestamp that's guaranteed to be fresh (within staleTime)
        const cachedData = { data: { id: 1, name: 'Cached' }, timestamp: Date.now() - 1000 };
        mockGetCache.mockReturnValue(cachedData);

        const { result } = renderHook(() => useData('/test'));

        expect(result.current.loading).toBe(false);
        expect(result.current.data).toEqual({ id: 1, name: 'Cached' });
        expect(apiClient).not.toHaveBeenCalled();
    });

    it('revalidates if cache is stale', async () => {
        // Stale time is 5 minutes (300000ms)
        const staleTimestamp = Date.now() - 300001;
        const cachedData = { data: { id: 1, name: 'Stale' }, timestamp: staleTimestamp };
        mockGetCache.mockReturnValue(cachedData);
        apiClient.mockResolvedValue({ id: 1, name: 'Fresh' });

        const { result } = renderHook(() => useData('/test'));

        // Should show stale data first but trigger fetch
        expect(result.current.data).toEqual({ id: 1, name: 'Stale' });

        // Wait for API call
        await waitFor(() => {
            expect(apiClient).toHaveBeenCalledWith('/test');
        });

        // Wait for fresh data to be set
        await waitFor(() => {
            expect(result.current.data).toEqual({ id: 1, name: 'Fresh' });
        });
    });

    it('handles errors', async () => {
        mockGetCache.mockReturnValue(null);
        const error = new Error('Network Error');
        apiClient.mockRejectedValue(error);

        const { result } = renderHook(() => useData('/error'));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe(error);
    });
});

describe('useDataMutations Hook', () => {
    const mockInvalidate = vi.fn();

    beforeEach(() => {
        DataContextExports.useDataEngine.mockReturnValue({
            invalidate: mockInvalidate
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('calls create mutation', async () => {
        apiClient.mockResolvedValue({ id: 123 });
        const { result } = renderHook(() => useDataMutations('/users'));

        let response;
        await act(async () => {
            response = await result.current.create({ name: 'New User' });
        });

        expect(apiClient).toHaveBeenCalledWith('/users', {
            method: 'POST',
            body: { name: 'New User' }
        });
        expect(mockInvalidate).toHaveBeenCalledWith('/users');
        expect(response.success).toBe(true);
    });

    it('calls update mutation', async () => {
        apiClient.mockResolvedValue({ id: 123, updated: true });
        const { result } = renderHook(() => useDataMutations('/users'));

        await act(async () => {
            await result.current.update('123', { name: 'Updated' });
        });

        expect(apiClient).toHaveBeenCalledWith('/users/123', {
            method: 'PUT',
            body: { name: 'Updated' }
        });
        expect(mockInvalidate).toHaveBeenCalledWith('/users');
    });

    it('calls delete mutation', async () => {
        apiClient.mockResolvedValue({ deleted: true });
        const { result } = renderHook(() => useDataMutations('/users'));

        await act(async () => {
            await result.current.delete('123');
        });

        expect(apiClient).toHaveBeenCalledWith('/users/123', {
            method: 'DELETE',
            body: null
        });
        expect(mockInvalidate).toHaveBeenCalledWith('/users');
    });
});
