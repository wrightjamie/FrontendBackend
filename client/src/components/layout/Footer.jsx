import React from 'react';
import styles from './Footer.module.css';
import { useSiteMeta } from '../../hooks/useSiteMeta';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { meta } = useSiteMeta();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p>&copy; {currentYear} {meta.title}. {meta.footerText || 'All rights reserved.'}</p>
                <div className={styles.links}>
                    {meta.footerLinks?.length > 0 ? (
                        meta.footerLinks.map((link, i) => (
                            <a key={i} href={link.url}>{link.label || link.url}</a>
                        ))
                    ) : (
                        <>
                            <a href="/privacy">Privacy</a>
                            <a href="/terms">Terms</a>
                            <a href="/support">Support</a>
                        </>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
