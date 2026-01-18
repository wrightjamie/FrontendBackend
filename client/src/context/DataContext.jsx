import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

const DataContext = createContext(null);

/**
 * DataProvider: The central "Engine" for our Stale-While-Revalidate caching.
 * Uses a Map to store data by endpoint URL.
 * 
 * Provides:
 * - getCache(key): Retrieve data from cache.
 * - setCache(key, data): Store data in cache and update timestamp.
 * - invalidate(key?): Clear specific or all cache entries.
 * - cacheVersion: Incremented on every cache change to trigger re-renders in consumers.
 */
export const DataProvider = ({ children }) => {
    // We use a ref for the cache to keep it stable and outside of the React render cycle
    // for immediate updates, but use state for "cache version" to trigger re-renders
    const cache = useRef(new Map());
    const [cacheVersion, setCacheVersion] = useState(0);

    /**
     * setCache: Updates the internal ref and increments the version counter.
     */
    const setCache = useCallback((key, data) => {
        cache.current.set(key, {
            data,
            timestamp: Date.now(),
        });
        setCacheVersion(v => v + 1);
    }, []);

    /**
     * getCache: Retrieves an entry from the internal ref.
     */
    const getCache = useCallback((key) => {
        return cache.current.get(key);
    }, []);

    /**
     * invalidate: Clears a specific entry or the entire cache.
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
        cacheVersion
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/**
 * useDataEngine: Access the low-level data cache and invalidation methods.
 */
export const useDataEngine = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataEngine must be used within a DataProvider');
    }
    return context;
};
