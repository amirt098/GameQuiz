import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, requiredRole }) => {
    const { user } = useAuth();

    // If there's no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user has no role or if a specific role is required but user doesn't have it
    if (!user.role || (requiredRole && user.role !== requiredRole)) {
        // Default to player home if no role, otherwise use user's role
        const redirectPath = !user.role ? '/player-home' : `/${user.role.toLowerCase()}-home`;
        return <Navigate to={redirectPath} replace />;
    }

    return element;
};

export default PrivateRoute;
