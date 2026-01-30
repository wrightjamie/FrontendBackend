import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './TabNavigation.module.css';

/**
 * Reusable Tab Navigation Component
 * @param {Array} tabs - Array of objects { path: string, label: string }
 */
const TabNavigation = ({ tabs }) => {
    return (
        <nav className={styles.tabsContainer}>
            {tabs.map((tab) => (
                <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                        `${styles.tab} ${isActive ? styles.activeTab : ''}`
                    }
                >
                    {tab.label}
                </NavLink>
            ))}
        </nav>
    );
};

export default TabNavigation;
