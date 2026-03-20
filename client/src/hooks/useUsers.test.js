import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useUsers, usePendingCount, useUserMutations } from './useUsers';
import { useData } from './useData';
import apiClient from '../api/apiClient';

vi.mock('./useData', () => ({
    useData: vi.fn()
}));

vi.mock('../api/apiClient', () => ({
    default: vi.fn()
}));

describe('useUsers hooks', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('useUsers', () => {
        it('calls useData with /users', () => {
            useData.mockReturnValue({ data: [{ id: 1 }], loading: false, error: null });
            const { result } = renderHook(() => useUsers());
            expect(useData).toHaveBeenCalledWith('/users');
            expect(result.current.data).toEqual([{ id: 1 }]);
        });
    });

    describe('usePendingCount', () => {
        it('calls useData with /users/pending-count', () => {
            useData.mockReturnValue({ data: { count: 5 }, loading: false, error: null });
            const { result } = renderHook(() => usePendingCount());
            expect(useData).toHaveBeenCalledWith('/users/pending-count');
            expect(result.current.data).toEqual({ count: 5 });
        });
    });

    describe('useUserMutations', () => {
        it('updateUser calls apiClient put /users/:id', async () => {
            apiClient.mockResolvedValue({ success: true });
            const { result } = renderHook(() => useUserMutations());
            
            let response;
            await act(async () => {
                response = await result.current.updateUser('123', { role: 'admin' });
            });
            
            expect(apiClient).toHaveBeenCalledWith('/users/123', {
                method: 'PUT',
                body: { role: 'admin' }
            });
            expect(response.success).toBe(true);
        });

        it('approveUser calls apiClient put /users/:id/approve', async () => {
            apiClient.mockResolvedValue({ success: true });
            const { result } = renderHook(() => useUserMutations());
            
            await act(async () => {
                await result.current.approveUser('123');
            });
            
            expect(apiClient).toHaveBeenCalledWith('/users/123/approve', {
                method: 'PUT',
                body: null
            });
        });

        it('resetPassword calls apiClient put /users/:id/password', async () => {
            apiClient.mockResolvedValue({ success: true });
            const { result } = renderHook(() => useUserMutations());
            
            await act(async () => {
                await result.current.resetPassword('123', 'newpass123');
            });
            
            expect(apiClient).toHaveBeenCalledWith('/users/123/password', {
                method: 'PUT',
                body: { password: 'newpass123' }
            });
        });

        it('deleteUser calls apiClient delete /users/:id', async () => {
            apiClient.mockResolvedValue({ success: true });
            const { result } = renderHook(() => useUserMutations());
            
            await act(async () => {
                await result.current.deleteUser('123');
            });
            
            expect(apiClient).toHaveBeenCalledWith('/users/123', {
                method: 'DELETE',
                body: null
            });
        });
        
        it('handles API errors gracefully', async () => {
            const error = new Error('API failed');
            apiClient.mockRejectedValue(error);
            const { result } = renderHook(() => useUserMutations());
            
            let response;
            await act(async () => {
                response = await result.current.deleteUser('123');
            });
            
            expect(response.success).toBe(false);
            expect(response.error).toBe(error);
            expect(result.current.error).toBe(error);
        });
    });
});
