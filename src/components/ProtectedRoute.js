import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isUserEmailVerified, signOutUser } from '../firebase/authFunctions';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (currentUser && !isUserEmailVerified(currentUser)) {
            signOutUser();
        }
    }, [currentUser]);

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

    if (!currentUser || !isUserEmailVerified(currentUser)) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location,
                    email: currentUser?.email || undefined,
                    needVerification: currentUser && !isUserEmailVerified(currentUser),
                }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
