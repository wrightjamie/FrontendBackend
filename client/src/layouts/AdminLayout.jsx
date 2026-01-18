import React from 'react';
import { Outlet } from 'react-router-dom';
import TabNavigation from '../components/TabNavigation';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const adminTabs = [
        { path: 'users', label: 'Users' },
        { path: 'data', label: 'Data' },
        { path: 'settings', label: 'Settings' },
        { path: 'test-toasts', label: 'Test Toasts' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <TabNavigation tabs={adminTabs} />
            </header>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
