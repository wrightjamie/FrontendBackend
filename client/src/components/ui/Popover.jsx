import React, { forwardRef } from 'react';
import styles from './Popover.module.css';

export const Popover = forwardRef(({ id, children, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            id={id}
            popover="auto"
            className={`${styles.popover} ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
});

Popover.displayName = 'Popover';
