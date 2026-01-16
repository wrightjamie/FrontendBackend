import React from 'react';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.container}>
            <h1>Welcome to the App</h1>
            <p>This is the home page. Navigation logic is now active.</p>
        </div>
    );
};

export default Home;
