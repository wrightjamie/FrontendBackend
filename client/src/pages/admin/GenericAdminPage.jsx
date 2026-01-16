import React from 'react';

const GenericAdminPage = ({ title }) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>This is a placeholder page for {title}.</p>
        </div>
    );
};

export default GenericAdminPage;
