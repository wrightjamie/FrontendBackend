import { useData, useDataMutations } from './useData';
import { useMemo } from 'react';

/**
 * useSiteMeta: Specialized hook for site title, description, and logo.
 */
export const useSiteMeta = () => {
    // We use /site-meta as the source of truth
    const { data, loading, error, refresh } = useData('/site/meta', { staleTime: 600000 }); // 10 min stale time for meta

    // Provide defaults if data is missing
    const meta = useMemo(() => ({
        title: data?.title || 'Vantage',
        description: data?.description || 'Your Standard Data Highway',
        logoUrl: data?.logoUrl || null
    }), [data]);

    return { meta, loading, error, refresh };
};

/**
 * useSiteMetaMutations: For updating site metadata.
 */
export const useSiteMetaMutations = () => {
    const { update, loading, error } = useDataMutations('/site/meta');

    const updateMeta = async (newMeta) => {
        // We pass no ID because site meta is typically a single record
        return await update('', newMeta);
    };

    return { updateMeta, loading, error };
};
