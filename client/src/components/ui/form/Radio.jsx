import React, { forwardRef } from 'react';
import styles from './CheckboxRadio.module.css';

export const Radio = forwardRef(({
    label,
    description,
    error,
    id,
    className,
    ...props
}, ref) => {
    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <label htmlFor={inputId} className={`${styles.container} ${className || ''}`}>
            <input
                ref={ref}
                id={inputId}
                type="radio"
                className={`${styles.input} ${error ? styles.error : ''}`}
                aria-invalid={!!error}
                {...props}
            />
            <div className={styles.textWrapper}>
                <span className={`${styles.label} ${error ? styles.error : ''}`}>{label}</span>
                {description && <span className={styles.description}>{description}</span>}
            </div>
        </label>
    );
});

Radio.displayName = 'Radio';
