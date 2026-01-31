import React, { forwardRef, useState } from 'react';
import styles from './FileUpload.module.css';

export const FileUpload = forwardRef(({
    label,
    error,
    id,
    className,
    onChange,
    accept,
    ...props
}, ref) => {
    const inputId = id || `file-${Math.random().toString(36).substr(2, 9)}`;
    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : '');
        if (onChange) onChange(e);
    };

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {label && <span className={styles.label}>{label}</span>}

            <label htmlFor={inputId} className={styles.uploadButton}>
                {fileName ? `Change File: ${fileName}` : 'Choose File...'}
            </label>

            <input
                ref={ref}
                id={inputId}
                type="file"
                className={styles.hiddenInput}
                onChange={handleChange}
                accept={accept}
                aria-invalid={!!error}
                {...props}
            />

            {error && <p className={styles.errorText}>{error}</p>}
            {fileName && !error && <p className={styles.fileName}>{fileName}</p>}
        </div>
    );
});

FileUpload.displayName = 'FileUpload';
