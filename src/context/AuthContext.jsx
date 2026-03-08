import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sign up with email and password
    async function signup(email, password, name) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                uid: userCredential.user.uid,
                name: name,
                email: email,
                plan: 'free',
                createdAt: new Date()
            });
            return userCredential;
        } catch (error) {
            throw error;
        }
    }

    // Login with email and password
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Login with Google
    async function loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            // Check if user already exists in Firestore, if not create them
            const userRef = doc(db, 'users', result.user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: result.user.uid,
                    name: result.user.displayName || 'New User',
                    email: result.user.email,
                    plan: 'free',
                    photoURL: result.user.photoURL,
                    createdAt: new Date()
                });
            }

            return result;
        } catch (error) {
            throw error;
        }
    }

    // Logout
    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch additional user data from Firestore
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                } else {
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
        signup,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
