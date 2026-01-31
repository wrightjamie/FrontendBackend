import React from 'react';
import { Zap, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useSiteMeta } from '../../hooks/useSiteMeta';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user } = useAuth();
    const { meta } = useSiteMeta();
    const isLoggedIn = !!user;

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
                        <span className={styles.logoIcon}><Zap size={24} fill="var(--color-primary)" /></span>
                    )}
                    <span className={styles.logoText}>{meta.title}</span>
                </Link>
                <div className={styles.actions}>
                    <Button
                        className={styles.userBtn}
                        popoverTarget="login-popover"
                        size="sm"
                        flat
                    >
                        <UserIcon size={16} />
                        <span>{isLoggedIn ? user.username || 'User' : 'Login'}</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
