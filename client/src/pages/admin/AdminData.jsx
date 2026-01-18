import React, { useState, useEffect } from 'react';
import { useDataTypes } from '../../hooks/useDynamicData';
import DynamicDataTable from '../../components/admin/DynamicDataTable';
import styles from './AdminData.module.css';

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
                    {showGuide ? 'Hide Schema Guide' : 'Show Schema Guide'}
                </button>
            </div>

            {showGuide && (
                <div className={styles.guide}>
                    <h3>Data Schema Configuration</h3>
                    <p>Each data type consists of fields defined by this common schema:</p>
                    <div className={styles.guideGrid}>
                        <div className={styles.guideItem}>
                            <strong>Name:</strong> The label displayed in the table header.
                        </div>
                        <div className={styles.guideItem}>
                            <strong>Type:</strong> The input method for the data (text, number, boolean, date).
                        </div>
                        <div className={styles.guideItem}>
                            <strong>Required:</strong> Whether the field must be completed to save a record.
                        </div>
                        <div className={styles.guideItem}>
                            <strong>Default:</strong> The initial value assigned to new records.
                        </div>
                    </div>

                    <div className={styles.guideExamples}>
                        <h4>Examples:</h4>
                        <div className={styles.exampleCard}>
                            <strong>Brands (Ordered):</strong>
                            <ul>
                                <li>Field: "Name" (text, required)</li>
                                <li>Field: "Website" (text)</li>
                                <li>Field: "Is Featured" (boolean, default: false)</li>
                            </ul>
                        </div>
                        <div className={styles.exampleCard}>
                            <strong>Blog Posts:</strong>
                            <ul>
                                <li>Field: "Title" (text, required)</li>
                                <li>Field: "Published Date" (date)</li>
                                <li>Field: "Read Time" (number)</li>
                            </ul>
                        </div>
                    </div>

                    <p className={styles.guideNote}>
                        <em>* Reordering is available for types flagged as "Ordered" in their configuration.</em>
                    </p>
                </div>
            )}

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
