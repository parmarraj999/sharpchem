import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc'
            }}>
                <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid rgba(79, 70, 229, 0.1)',
                    borderTopColor: '#4f46e5',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    if (!currentUser) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
