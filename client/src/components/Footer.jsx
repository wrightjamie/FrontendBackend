import React from 'react';
import styles from './Footer.module.css';
import { useSiteMeta } from '../hooks/useSiteMeta';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { meta } = useSiteMeta();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>&copy; {currentYear} {meta.title}. All rights reserved.</p>
                <div className={styles.links}>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Support</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
