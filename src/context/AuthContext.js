import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase.config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const isStudentProfileComplete = (profile) => {
    if (!profile) return false;
    const hasClass = Boolean(String(profile.currentClass || '').trim());
    const hasGoal = Boolean(String(profile.goal || profile.examType || '').trim());
    return hasClass && hasGoal;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async (user) => {
        if (!user?.uid) {
            setProfile(null);
            return null;
        }
        try {
            const snap = await getDoc(doc(db, 'users', user.uid));
            const data = snap.exists() ? { uid: user.uid, ...snap.data() } : { uid: user.uid };
            setProfile(data);
            return data;
        } catch (err) {
            console.warn('Could not load user profile:', err);
            setProfile({ uid: user.uid });
            return { uid: user.uid };
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            await loadProfile(user);
            setLoading(false);
        });

        return unsubscribe;
    }, [loadProfile]);

    const value = {
        currentUser,
        profile,
        loading,
        refreshProfile: () => loadProfile(currentUser),
        profileComplete: isStudentProfileComplete(profile),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
