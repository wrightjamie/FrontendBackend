import React from 'react';
import styles from './UserButton.module.css';

const UserButton = ({ isLoggedIn, username }) => {
    return (
        <div className={styles.container}>
            <button
                className={styles.userButton}
                popovertarget="login-popover"
            >
                {isLoggedIn ? username || 'User' : 'Login'}
            </button>
        </div>
    );
};

export default UserButton;
