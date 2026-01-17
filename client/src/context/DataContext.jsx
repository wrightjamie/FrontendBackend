import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const DataContext = createContext(null);

/**
 * DataProvider: The central "Engine" for our Stale-While-Revalidate caching.
 * Uses a Map to store data by endpoint URL.
 */
export const DataProvider = ({ children }) => {
    // We use a ref for the cache to keep it stable and outside of the React render cycle
    // for immediate updates, but use state for "cache version" to trigger re-renders
    const cache = useRef(new Map());
    const [cacheVersion, setCacheVersion] = useState(0);

    /**
     * Set data in cache with a timestamp
     */
    const setCache = useCallback((key, data) => {
        cache.current.set(key, {
            data,
            timestamp: Date.now(),
        });
        setCacheVersion(v => v + 1);
    }, []);

    /**
     * Get data from cache
     */
    const getCache = useCallback((key) => {
        return cache.current.get(key);
    }, []);

    /**
     * Invalidate specific endpoint or entire cache
     */
    const invalidate = useCallback((key) => {
        if (key) {
            cache.current.delete(key);
        } else {
            cache.current.clear();
        }
        setCacheVersion(v => v + 1);
    }, []);

    const value = {
        getCache,
        setCache,
        invalidate,
        cacheVersion // Included so hooks can depend on it
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataEngine = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataEngine must be used within a DataProvider');
    }
    return context;
};
