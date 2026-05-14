import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    console.log(user);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Verifying authentication...</p>
            </div>
        );
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Handle case where user might be a raw string from stale cache, or an object
    const currentRole = typeof user === 'string' ? user : (user?.role || 'employee');

    if (allowedRoles && !allowedRoles.includes(currentRole)) {
        return (
            <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>You do not have permission to view this page.</p>
                <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>
                    <p><strong>Debug Info:</strong></p>
                    <p>Expected Roles: {allowedRoles.join(', ')}</p>
                    <p>Your Role: {currentRole}</p>
                    <p>Raw User Object: {JSON.stringify(user)}</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
