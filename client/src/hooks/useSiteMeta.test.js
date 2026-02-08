/**
 * @file useSiteMeta.test.js
 * @description Unit tests for the useSiteMeta hook.
 * 
 * @tests
 * 1. Returns default metadata when data is loading or missing.
 * 2. Returns fetched metadata when available.
 * 3. Mocks the underlying useData hook.
 */
import { renderHook, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useSiteMeta } from './useSiteMeta';
import * as useDataHook from './useData';

// Mock the useData hook
vi.mock('./useData', () => ({
    useData: vi.fn(),
    useDataMutations: vi.fn()
}));

describe('useSiteMeta', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('returns default meta when data is loading or missing', () => {
        // Mock the implementation of useData
        useDataHook.useData.mockReturnValue({
            data: null,
            loading: true,
            error: null,
            refresh: vi.fn()
        });

        const { result } = renderHook(() => useSiteMeta());

        // Check loading state
        // expect(result.current.loading).toBe(true);

        // Check default values
        expect(result.current.meta).toEqual({
            title: 'App Name',
            description: 'Welcome to the application',
            logo: null
        });
    });

    it('returns fetched meta data when available', () => {
        // Mock successful data fetch
        const mockData = {
            title: 'My Custom Site',
            description: 'The Best Site',
            logo: 'logo.png'
        };

        useDataHook.useData.mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
            refresh: vi.fn()
        });

        const { result } = renderHook(() => useSiteMeta());

        expect(result.current.meta).toEqual({
            title: 'My Custom Site',
            description: 'The Best Site',
            logo: 'logo.png'
        });
    });
});
