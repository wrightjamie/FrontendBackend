import React, { forwardRef, useId } from 'react';
import styles from './CheckboxRadio.module.css';

export const Radio = forwardRef(({
    label,
    description,
    error,
    id,
    className,
    ...props
}, ref) => {
    const fallbackId = useId();
    const inputId = id || fallbackId;

    return (
        <label htmlFor={inputId} className={`${styles.container} ${className || ''}`}>
            <input
                ref={ref}
                id={inputId}
                type="radio"
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
