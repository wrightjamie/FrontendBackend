import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './TabNavigation.module.css';

/**
 * Reusable Tab Navigation Component
 * @param {Array} tabs - Array of objects { path: string, label: string, value?: string }
 * @param {string} variant - 'underline' | 'pill'
 * @param {string} activeTab - Current active tab value (for state mode)
 * @param {function} onTabClick - Callback for tab click (enables state mode)
 */
const TabNavigation = ({ tabs, variant = 'underline', activeTab, onTabClick }) => {
    return (
        <nav className={styles.tabsContainer}>
            {tabs.map((tab) => {
                const key = tab.path || tab.value;
                const isActiveState = activeTab === key;

                // State Mode (Button)
                if (onTabClick) {
                    return (
                        <button
                            key={key}
                            className={`${styles.tab} ${styles[variant]} ${isActiveState ? styles.active : ''}`}
                            onClick={() => onTabClick(key)}
                            type="button"
                        >
                            {tab.label}
                        </button>
                    );
                }

                // Routing Mode (NavLink)
                return (
                    <NavLink
                        key={key}
                        to={tab.path}
                        className={({ isActive }) =>
                            `${styles.tab} ${styles[variant]} ${isActive ? styles.active : ''}`
                        }
                    >
                        {tab.label}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default TabNavigation;
