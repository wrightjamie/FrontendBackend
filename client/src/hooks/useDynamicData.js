import { useData, useDataMutations } from './useData';

/**
 * useDataTypes: Hook for fetching and managing data type definitions.
 */
export const useDataTypes = () => {
    return useData('/data/types');
};

/**
 * useDataEntities: Hook for fetching all entities of a specific type.
 * @param {string} typeId - The ID of the data type.
 */
export const useDataEntities = (typeId) => {
    return useData(typeId ? `/data/entities/${typeId}` : null);
};

/**
 * useDynamicDataMutations: Standard CRUD operations for dynamic data.
 */
export const useDynamicDataMutations = (typeId) => {
    const { create, update, delete: del, loading, error } = useDataMutations(typeId ? `/data/entities/${typeId}` : '/data/entities');
    const { create: reorder } = useDataMutations('/data/entities/reorder');

    return {
        create,
        update: (id, body) => update(id, body), // In useDataMutations, update uses `${endpoint}/${id}`
        delete: del,
        reorder: (updates) => reorder({ updates }),
        loading,
        error
    };
};
