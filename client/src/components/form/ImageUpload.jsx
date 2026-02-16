import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import apiClient from '../../api/apiClient';
import styles from './ImageUpload.module.css';

/**
 * ImageUpload: Reusable component for uploading images.
 * @param {function} onUpload - Callback with { url, filename } on success.
 * @param {string} currentImage - URL of currently selected/uploaded image.
 * @param {boolean} showPreview - Whether to show the uploaded image in the box after success.
 */
const ImageUpload = ({ onUpload, currentImage, label = "Upload Image", showPreview = true, multiple = false }) => {
    const [preview, setPreview] = useState(currentImage || '');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setError('');
        setUploading(true);

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('image', file);
        });

        try {
            // Use fetch directly for FormData as apiClient handles JSON
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            // data.results is the array of uploaded media
            if (data.results && data.results.length > 0) {
                // For single file preview (backward compat or just showing the first one)
                const lastUrl = data.results[data.results.length - 1].url;
                setPreview(lastUrl);

                if (onUpload) {
                    onUpload(data.results);
                }

                if (showPreview) {
                    setPreview(lastUrl);
                } else {
                    setPreview('');
                }
            }
        } catch (err) {
            setError(err.message);
            setPreview('');
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        setPreview('');
        if (onUpload) {
            onUpload(null);
        }
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>

            <div
                className={styles.uploadArea}
                onClick={() => !preview && fileInputRef.current?.click()}
            >
                {preview ? (
                    <div className={styles.previewContainer}>
                        <img src={preview} alt="Preview" className={styles.preview} />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            className={styles.removeBtn}
                            title="Remove image"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <Upload size={24} className={styles.uploadIcon} />
                        <span>{uploading ? 'Uploading...' : 'Click to Upload'}</span>
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple={multiple}
                className={styles.hiddenInput}
                disabled={uploading}
            />

            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default ImageUpload;
