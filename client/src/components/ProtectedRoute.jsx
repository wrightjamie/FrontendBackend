import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>; // TODO: Better loading spinner later
    }

    if (!user) {
        // Redirect to home if not logged in
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Role not authorized
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
