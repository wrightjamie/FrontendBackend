import React from 'react';
import { Outlet } from 'react-router-dom';
import { Users, Database, Image as ImageIcon, Settings, TestTube } from 'lucide-react';
import TabNavigation from '../components/ui/TabNavigation';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const adminTabs = [
        { path: 'users', label: 'Users', icon: <Users size={18} /> },
        { path: 'data', label: 'Data', icon: <Database size={18} /> },
        { path: 'media', label: 'Media', icon: <ImageIcon size={18} /> },
        { path: 'settings', label: 'Settings', icon: <Settings size={18} /> },
        { path: 'test-toasts', label: 'Test Toasts', icon: <TestTube size={18} /> },
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
