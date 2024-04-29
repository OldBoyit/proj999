import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const PrivateRoute = ({ children }) => {
    const { user } = useUser();

    if (!user) {
        // Redirect to home if not logged in
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;