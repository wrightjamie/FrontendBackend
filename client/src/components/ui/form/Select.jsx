import React, { forwardRef, useId } from 'react';
import styles from './Select.module.css';

export const Select = forwardRef(({
    label,
    error,
    helperText,
    id,
    options = [],
    className,
    containerClassName,
    placeholder,
    ...props
}, ref) => {
    const fallbackId = useId();
    const selectId = id || (label ? fallbackId : undefined);

    return (
        <div className={`${styles.container} ${error ? styles.hasError : ''} ${containerClassName || ''}`}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.selectWrapper}>
                <select
                    ref={ref}
                    id={selectId}
                    className={`${styles.select} ${className || ''}`}
                    aria-invalid={!!error}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt, index) => {
                        const value = typeof opt === 'object' ? opt.value : opt;
                        const label = typeof opt === 'object' ? opt.label : opt;
                        return (
                            <option key={index} value={value}>
                                {label}
                            </option>
                        );
                    })}
                </select>
                <div className={styles.arrow} aria-hidden="true">▼</div>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}
            {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
        </div>
    );
});

Select.displayName = 'Select';
