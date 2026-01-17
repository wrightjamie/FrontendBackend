import React from 'react';
import UserButton from './UserButton';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoIcon}>⚡</span>
                    <span className={styles.logoText}>App Name</span>
                </Link>
                <div className={styles.actions}>
                    <UserButton />
                </div>
            </div>
        </header>
    );
};

export default Header;
