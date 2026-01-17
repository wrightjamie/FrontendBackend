import React, { useState, useEffect } from 'react';
import { useSiteMeta, useSiteMetaMutations } from '../../hooks/useSiteMeta';
import styles from './AdminSettings.module.css';

const AdminSettings = () => {
    const { meta, loading: loadingMeta } = useSiteMeta();
    const { updateMeta, loading: saving, error: saveError } = useSiteMetaMutations();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [isDirty, setIsDirty] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    // Sync form with loaded meta
    useEffect(() => {
        if (meta) {
            setFormData({
                title: meta.title || '',
                description: meta.description || '',
            });
        }
    }, [meta]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
        setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateMeta(formData);

        if (res.success) {
            setIsDirty(false);
            setStatus({ type: 'success', message: 'Settings saved successfully!' });
            // Hide message after a few seconds
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } else {
            setStatus({ type: 'error', message: 'Failed to save settings.' });
        }
    };

    if (loadingMeta) return <div className={styles.container}>Loading settings...</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>System Settings</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="title">Application Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className={styles.input}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter application name"
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="description">Description Tagline</label>
                    <textarea
                        id="description"
                        name="description"
                        className={styles.textarea}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Say something about this project"
                    />
                </div>

                {status.message && (
                    <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                        {status.message}
                    </div>
                )}

                {saveError && !status.message && (
                    <div className={`${styles.statusMessage} ${styles.error}`}>
                        Error: {saveError.message}
                    </div>
                )}

                <div className={styles.actions}>
                    <button
                        type="submit"
                        className={styles.saveBtn}
                        disabled={!isDirty || saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
