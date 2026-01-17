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
    // Create is type-specific: POST /api/data/entities/:typeId
    const { create, loading: createLoading, error: createError } = useDataMutations(typeId ? `/data/entities/${typeId}` : '/data/entities');

    // Update/Delete are generic: PUT/DELETE /api/data/entities/:id
    const { update, delete: del, loading: mutateLoading, error: mutateError } = useDataMutations('/data/entities');

    // Reorder: POST /api/data/entities/reorder
    const { create: reorderMutate, loading: reorderLoading, error: reorderError } = useDataMutations('/data/entities/reorder');

    return {
        create,
        update,
        delete: del,
        reorder: (updates) => reorderMutate({ updates }),
        loading: createLoading || mutateLoading || reorderLoading,
        error: createError || mutateError || reorderError
    };
};
