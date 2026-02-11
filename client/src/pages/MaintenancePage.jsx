import React from 'react';
import { useSiteMeta } from '../hooks/useSiteMeta';
import { Link } from 'react-router-dom';
import { Hammer } from 'lucide-react';
import styles from './MaintenancePage.module.css';

const MaintenancePage = () => {
    const { meta } = useSiteMeta();

    return (
        <div className={styles.container}>
            <div className={styles.glassCard}>
                <div className={styles.iconWrapper}>
                    <Hammer size={48} className={styles.icon} />
                </div>
                <h1 className={styles.title}>Under Maintenance</h1>
                <p className={styles.message}>
                    {meta.maintenanceMessage || 'We are currently performing scheduled maintenance to improve our services. Please check back soon!'}
                </p>
                <div className={styles.footer}>
                    {meta.title} System Administration
                    <div className={styles.adminRecovery}>
                        <Link to="/login" className={styles.recoveryLink}>Admin Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
