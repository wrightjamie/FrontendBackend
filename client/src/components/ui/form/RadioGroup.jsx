import React, { forwardRef } from 'react';
import { Radio } from './Radio';
import styles from './RadioGroup.module.css';

export const RadioGroup = forwardRef(({
    label,
    name,
    options = [],
    value,
    onChange,
    error,
    direction = 'column',
    className,
    ...props
}, ref) => {
    // Ensure we have a name for the group logic to work natively
    const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <fieldset
            ref={ref}
            className={`${styles.fieldset} ${styles[direction]} ${className || ''}`}
            aria-invalid={!!error}
            {...props}
        >
            {label && <legend className={styles.legend}>{label}</legend>}

            {options.map((option) => (
                <Radio
                    key={option.value}
                    id={`${groupName}-${option.value}`}
                    name={groupName}
                    label={option.label}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange(option.value)}
                    error={!!error}
                    disabled={option.disabled}
                />
            ))}

            {error && <div className={styles.errorText}>{error}</div>}
        </fieldset>
    );
});

RadioGroup.displayName = 'RadioGroup';
