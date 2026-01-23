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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await apiClient(`/upload/${id}`, { method: 'DELETE' });
            addToast('Image deleted', 'success');
            setImages(prev => prev.filter(img => img._id !== id));
        } catch (err) {
            addToast('Failed to delete image', 'error');
        }
    };

    const copyToClipboard = (url) => {
        const fullUrl = window.location.origin + url;
        navigator.clipboard.writeText(fullUrl);
        addToast('URL copied to clipboard', 'success');
    };

    const handleTitleUpdate = async (id, newTitle) => {
        try {
            await apiClient(`/upload/${id}`, {
                method: 'PUT',
                body: { title: newTitle }
            });
            setImages(prev => prev.map(img =>
                img._id === id ? { ...img, title: newTitle } : img
            ));
        } catch (err) {
            addToast('Failed to update title', 'error');
        }
    };

    const handleUploadSuccess = (newImage) => {
        addToast('Image uploaded successfully', 'success');
        setImages(prev => [newImage, ...prev]);
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
                            <div key={img._id} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={img.thumbnailUrl || img.url}
                                        alt={img.title || img.filename}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.actions}>
                                    <button
                                        onClick={() => copyToClipboard(img.url)}
                                        className={styles.copyBtn}
                                        title="Copy Full URL"
                                    >
                                        🔗
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className={styles.deleteBtn}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <div className={styles.titleArea}>
                                    <input
                                        type="text"
                                        defaultValue={img.title || img.filename}
                                        onBlur={(e) => handleTitleUpdate(img._id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.target.blur();
                                            }
                                        }}
                                        className={styles.titleInput}
                                        title="Click to edit title"
                                    />
                                    <div className={styles.originalName} title={img.originalName}>
                                        {img.originalName}
                                    </div>
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
