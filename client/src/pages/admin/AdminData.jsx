import React, { useState, useEffect } from 'react';
import { useDataTypes } from '../../hooks/useDynamicData';
import DynamicDataTable from '../../components/admin/DynamicDataTable';
import styles from './AdminData.module.css';

const AdminData = () => {
    const { data: types, loading, error } = useDataTypes();
    const [activeTypeId, setActiveTypeId] = useState(null);

    // Set first type as active by default once loaded
    useEffect(() => {
        if (types && types.length > 0 && !activeTypeId) {
            setActiveTypeId(types[0]._id);
        }
    }, [types, activeTypeId]);

    if (loading) return <div className={styles.loading}>Loading data configurations...</div>;
    if (error) return <div className={styles.error}>Error: {error.message}</div>;

    const activeType = types?.find(t => t._id === activeTypeId);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <h2>Data Management</h2>
                    <p>Manage content records across your application's data types.</p>
                </div>
            </div>

            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    {types?.map(type => (
                        <button
                            key={type._id}
                            className={`${styles.tab} ${activeTypeId === type._id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTypeId(type._id)}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                {activeType ? (
                    <DynamicDataTable key={activeTypeId} type={activeType} />
                ) : (
                    <div className={styles.empty}>No data types defined.</div>
                )}
            </div>
        </div>
    );
};

export default AdminData;
