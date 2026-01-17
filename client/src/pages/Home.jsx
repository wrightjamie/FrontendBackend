import React from 'react';
import styles from './Home.module.css';

import { useSiteMeta } from '../hooks/useSiteMeta';

const Home = () => {
    const { meta, loading } = useSiteMeta();

    return (
        <div className={styles.container}>
            <h1>{loading ? 'Loading...' : `Welcome to ${meta.title}`}</h1>
            <p>{meta.description}</p>
            <p>This is the home page. Navigation logic is now active.</p>
        </div>
    );
};

export default Home;
