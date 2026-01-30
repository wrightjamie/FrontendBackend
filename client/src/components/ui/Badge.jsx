import React from 'react';
import styles from './Badge.module.css';

export function Badge({
    variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info'
    children,
    className: customClassName,
    ...props
}) {
    const className = [
        styles.badge,
        variant !== 'default' && styles[variant],
        customClassName
    ].filter(Boolean).join(' ');

    return (
        <span className={className} {...props}>
            {children}
        </span>
    );
}
