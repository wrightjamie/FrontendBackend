import React from 'react';
import styles from './CenteredLayout.module.css';

const CenteredLayout = ({ children, className }) => {
    return (
        <div className={`${styles.container} ${className || ''}`}>
            {children}
        </div>
    );
};

export default CenteredLayout;
