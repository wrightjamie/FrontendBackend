import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';
import styles from './AdminMedia.module.css';
import ImageUpload from '../../components/ImageUpload';

const AdminMedia = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await apiClient('/upload');
            setImages(data);
        } catch (err) {
            addToast('Failed to load images', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleDelete = async (filename) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await apiClient(`/upload/${filename}`, { method: 'DELETE' });
            addToast('Image deleted', 'success');
            setImages(prev => prev.filter(img => img.filename !== filename));
        } catch (err) {
            addToast('Failed to delete image', 'error');
        }
    };

    const copyToClipboard = (url) => {
        const fullUrl = window.location.origin + url;
        navigator.clipboard.writeText(fullUrl);
        addToast('URL copied to clipboard', 'success');
    };

    const handleUploadSuccess = (newImage) => {
        addToast('Image uploaded successfully', 'success');
        // Refresh list or add explicitly if return format matches
        fetchImages();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Media Library</h2>
                <div className={styles.uploader}>
                    <ImageUpload
                        onUpload={handleUploadSuccess}
                        label="Upload New Image"
                    />
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading library...</div>
            ) : (
                <div className={styles.grid}>
                    {images.length === 0 ? (
                        <p className={styles.empty}>No images found.</p>
                    ) : (
                        images.map(img => (
                            <div key={img.filename} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img src={img.url} alt={img.filename} loading="lazy" />
                                </div>
                                <div className={styles.actions}>
                                    <button
                                        onClick={() => copyToClipboard(img.url)}
                                        className={styles.copyBtn}
                                        title="Copy URL"
                                    >
                                        🔗
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.filename)}
                                        className={styles.deleteBtn}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <div className={styles.filename} title={img.filename}>
                                    {img.filename}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminMedia;
