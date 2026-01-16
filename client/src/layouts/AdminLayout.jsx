import React from 'react';
import { Outlet } from 'react-router-dom';
import TabNavigation from '../components/TabNavigation';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const adminTabs = [
        { path: 'users', label: 'Users' },
        { path: 'data', label: 'Data' },
        { path: 'settings', label: 'Settings' },
        { path: 'analytics', label: 'Analytics' },
        { path: 'logs', label: 'System Logs' },
        { path: 'security', label: 'Security' },
        { path: 'roles', label: 'Permissions & Roles' },
        { path: 'audit', label: 'Audit Trail' },
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
