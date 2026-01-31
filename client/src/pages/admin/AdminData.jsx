import React, { useState, useEffect } from 'react';
import { useDataTypes } from '../../hooks/useDynamicData';
import DynamicDataTable from '../../components/admin/DynamicDataTable';
import TabNavigation from '../../components/ui/TabNavigation';
import { Info } from 'lucide-react';
import styles from './AdminData.module.css';

/**
 * AdminData: Management page for dynamic data types.
 * Renders tabs for each data type and a DynamicDataTable for the active type.
 */
const AdminData = () => {
    const { data: types, loading, error } = useDataTypes();
    const [activeTypeId, setActiveTypeId] = useState(null);

    const [showGuide, setShowGuide] = useState(false);

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
                <button
                    className={styles.guideToggle}
                    onClick={() => setShowGuide(!showGuide)}
                >
                    <Info size={16} />
                    <span>{showGuide ? 'Hide Schema Guide' : 'Show Schema Guide'}</span>
                </button>
            </div>

            {showGuide && (
                <div className={styles.guide}>
                    <h3>Data Schema Configuration</h3>
                    <p>Each data type consists of fields defined by a common schema:</p>
                    <div className={styles.guideGrid}>
                        <div className={styles.guideItem}>
                            <strong>Name:</strong> The label displayed in the table header.
                        </div>
                        <div className={styles.guideItem}>
                            <strong>Type:</strong> The input method (text, number, boolean, date).
                        </div>
                        <div className={styles.guideItem}>
                            <strong>Required:</strong> Whether the field must be completed to save.
                        </div>
                        <div className={styles.guideItem}>
                            <strong>Default:</strong> The initial value assigned to new records.
                        </div>
                        <div className={styles.guideItem}>
                            <strong>Permissions:</strong> Controls for "canAdd", "canEdit", and "canDelete".
                        </div>
                    </div>

                    <p className={styles.guideNote}>
                        <em>* Reordering functionality is available for types flagged as "Ordered" in their configuration.</em>
                    </p>
                </div>
            )}

            {types && (
                <TabNavigation
                    tabs={types.map(t => ({ path: t._id, label: t.name }))}
                    variant="pill"
                    activeTab={activeTypeId}
                    onTabClick={setActiveTypeId}
                />
            )}

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
