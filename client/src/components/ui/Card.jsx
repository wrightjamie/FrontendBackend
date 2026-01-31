import React from 'react';
import styles from './Card.module.css';

export const Card = ({ children, className, dense = false, ...props }) => {
    return (
        <div
            className={`${styles.card} ${dense ? styles.dense : ''} ${className || ''}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className, ...props }) => {
    return (
        <div className={`${styles.header} ${className || ''}`} {...props}>
            {children}
        </div>
    );
};

export const CardBody = ({ children, className, ...props }) => {
    return (
        <div className={`${styles.body} ${className || ''}`} {...props}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className, ...props }) => {
    return (
        <div className={`${styles.footer} ${className || ''}`} {...props}>
            {children}
        </div>
    );
};
