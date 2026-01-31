import React, { forwardRef } from 'react';
import styles from './Input.module.css';

export const Input = forwardRef(({
    label,
    error,
    helperText,
    id,
    className,
    containerClassName,
    type = 'text',
    icon: Icon,
    ...props
}, ref) => {
    // Generate a unique ID if one isn't provided but a label is present
    const inputId = id || (label ? `input-${Math.random().toString(36).substr(2, 9)}` : undefined);

    return (
        <div className={`${styles.container} ${error ? styles.hasError : ''} ${containerClassName || ''}`}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={`${styles.inputWrapper} ${Icon ? styles.hasIcon : ''}`}>
                {Icon && (
                    <div className={styles.iconContainer}>
                        <Icon size={18} />
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    className={`${styles.input} ${className || ''}`}
                    aria-invalid={!!error}
                    {...props}
                />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}
            {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
        </div>
    );
});

Input.displayName = 'Input';
