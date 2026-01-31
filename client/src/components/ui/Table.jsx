import React from 'react';
import styles from './Table.module.css';

export const Table = ({ children, className, dense = false, ...props }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={`${styles.table} ${dense ? styles.dense : ''} ${className || ''}`} {...props}>
                {children}
            </table>
        </div>
    );
};

export const Thead = ({ children, className, ...props }) => {
    return (
        <thead className={`${styles.thead} ${className || ''}`} {...props}>
            {children}
        </thead>
    );
};

export const Tbody = ({ children, className, ...props }) => {
    return (
        <tbody className={`${styles.tbody} ${className || ''}`} {...props}>
            {children}
        </tbody>
    );
};

export const Tr = ({ children, className, ...props }) => {
    return (
        <tr className={`${styles.tr} ${className || ''}`} {...props}>
            {children}
        </tr>
    );
};

export const Th = ({ children, className, ...props }) => {
    return (
        <th className={`${styles.th} ${className || ''}`} {...props}>
            {children}
        </th>
    );
};

export const Td = ({ children, className, ...props }) => {
    return (
        <td className={`${styles.td} ${className || ''}`} {...props}>
            {children}
        </td>
    );
};
