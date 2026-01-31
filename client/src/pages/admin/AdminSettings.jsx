import React, { useState, useEffect } from 'react';
import { useSiteMeta, useSiteMetaMutations } from '../../hooks/useSiteMeta';
import { useToast } from '../../context/ToastContext';
import { Settings } from 'lucide-react';
import ImageSelect from '../../components/form/ImageSelect';
import styles from './AdminSettings.module.css';

const AdminSettings = () => {
    const { meta, loading: loadingMeta } = useSiteMeta();
    const { updateMeta, loading: saving } = useSiteMetaMutations();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        logo: '',
    });
    const [isDirty, setIsDirty] = useState(false);

    // Sync form with loaded meta
    useEffect(() => {
        if (meta) {
            setFormData({
                title: meta.title || '',
                description: meta.description || '',
                logo: meta.logo || '',
            });
        }
    }, [meta]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateMeta(formData);

        if (res.success) {
            setIsDirty(false);
            addToast('Settings saved successfully!', 'success');
        } else {
            addToast('Failed to save settings.', 'error');
        }
    };

    if (loadingMeta) return <div className={styles.container}>Loading settings...</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                <Settings size={28} />
                <span>System Settings</span>
            </h2>

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

                <div className={styles.field}>
                    <ImageSelect
                        label="Site Logo"
                        value={formData.logo}
                        onChange={(url) => {
                            setFormData(prev => ({ ...prev, logo: url }));
                            setIsDirty(true);
                        }}
                    />
                </div>

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
