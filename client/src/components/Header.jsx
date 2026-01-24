import React from 'react';
import UserButton from './UserButton';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useSiteMeta } from '../hooks/useSiteMeta';

const Header = () => {
    const { meta } = useSiteMeta();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    {meta.logo ? (
                        <img
                            src={`${meta.logo}?v=${Date.now()}`}
                            alt={meta.title}
                            className={styles.logoImage}
                        />
                    ) : (
                        <span className={styles.logoIcon}>⚡</span>
                    )}
                    <span className={styles.logoText}>{meta.title}</span>
                </Link>
                <div className={styles.actions}>
                    <UserButton />
                </div>
            </div>
        </header>
    );
};

export default Header;
