import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/apiClient';
import { useToast } from '../context/ToastContext';
import styles from './ImageSelect.module.css';
import ImageUpload from './ImageUpload';

/**
 * ImageSelect: A premium popover component for selecting images from the library
 * or uploading new ones.
 * @param {string} value - Current selected image URL.
 * @param {function} onChange - Callback when an image is selected/changed.
 * @param {string} label - Label for the field.
 */
const ImageSelect = ({ value, onChange, label = "Select Image" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState('browse'); // 'browse' or 'upload'
    const popoverRef = useRef(null);
    const { addToast } = useToast();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await apiClient('/upload');
            setImages(data);
        } catch (err) {
            addToast('Failed to load media library', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && tab === 'browse') {
            fetchImages();
        }
    }, [isOpen, tab]);

    const handleSelect = (url) => {
        onChange(url);
        setIsOpen(false);
    };

    const handleUploadSuccess = (data) => {
        if (data) {
            onChange(data.url);
            setIsOpen(false);
            addToast('Image uploaded and selected', 'success');
        }
    };

    return (
        <div className={styles.container} ref={popoverRef}>
            <label className={styles.label}>{label}</label>

            <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
                {value ? (
                    <div className={styles.previewWrapper}>
                        <img src={`${value}?v=${Date.now()}`} alt="Selected" className={styles.selectedPreview} />
                        <div className={styles.changeOverlay}>Change</div>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <span>Pick an Image</span>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className={styles.popover}>
                    <div className={styles.popoverHeader}>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${tab === 'browse' ? styles.activeTab : ''}`}
                                onClick={() => setTab('browse')}
                            >
                                Browse Library
                            </button>
                            <button
                                className={`${styles.tab} ${tab === 'upload' ? styles.activeTab : ''}`}
                                onClick={() => setTab('upload')}
                            >
                                Upload New
                            </button>
                        </div>
                    </div>

                    <div className={styles.popoverContent}>
                        {tab === 'browse' ? (
                            <div className={styles.libraryGrid}>
                                {loading ? (
                                    <div className={styles.status}>Loading...</div>
                                ) : images.length === 0 ? (
                                    <div className={styles.status}>No images found</div>
                                ) : (
                                    images.map(img => (
                                        <div
                                            key={img._id}
                                            className={`${styles.imageCard} ${value === img.url ? styles.selectedCard : ''}`}
                                            onClick={() => handleSelect(img.url)}
                                            title={img.title || img.filename}
                                        >
                                            <img src={img.thumbnailUrl || img.url} alt={img.title} />
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className={styles.uploadSection}>
                                <ImageUpload
                                    onUpload={handleUploadSuccess}
                                    showPreview={false}
                                    label="Drop a file here"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageSelect;
