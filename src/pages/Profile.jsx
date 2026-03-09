import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, User, Mail, Save, LogOut, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({ name: '', email: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Protect route
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Fetch user data from Firestore
    useEffect(() => {
        async function fetchUserData() {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        // Fallback to auth object if not in Firestore (e.g. older Google signins)
                        setUserData({ name: currentUser.displayName || '', email: currentUser.email || '' });
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    setError("Failed to load profile data.");
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchUserData();
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setSaving(true);

        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                name: userData.name
            });
            setSuccessMessage('Profile updated successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans relative flex items-center justify-center p-6 overflow-hidden transition-colors duration-300">
            {/* Background ambient light */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-purple-600/15 rounded-full blur-[120px] mix-blend-screen"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-lg relative z-10"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-[2.5rem] blur-xl opacity-20 dark:opacity-40 animate-pulse-glow pointer-events-none" />

                <div className="glass-panel p-10 rounded-[2rem] border border-[var(--glass-border)] relative backdrop-blur-3xl bg-white/80 dark:bg-black/40 shadow-2xl">
                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                        <Link to="/" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-xl shadow-indigo-500/20 mb-4 transform hover:scale-105 transition-transform">
                            <div className="w-full h-full bg-[var(--bg-color)] rounded-full flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600 uppercase">
                                {userData.name ? userData.name.charAt(0) : <User className="w-10 h-10 text-indigo-500" />}
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold font-outfit tracking-tight">{userData.name || 'User Profile'}</h2>
                        <p className="text-[var(--text-secondary)]">Manage your account settings</p>
                    </motion.div>

                    {error && (
                        <motion.div variants={itemVariants} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium">
                            {error}
                        </motion.div>
                    )}

                    {successMessage && (
                        <motion.div variants={itemVariants} className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 dark:text-green-400 text-sm text-center font-medium">
                            {successMessage}
                        </motion.div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-5">
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Full Name</label>
                                <div className="relative flex items-center">
                                    <User className="absolute left-4 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
                                    <input
                                        type="text"
                                        required
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className="w-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-[var(--glass-border)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--text-primary)] placeholder-zinc-400 dark:placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm dark:shadow-none"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Email address</label>
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 w-5 h-5 text-[var(--text-secondary)] pointer-events-none opacity-50" />
                                    <input
                                        type="email"
                                        value={userData.email}
                                        disabled
                                        className="w-full bg-zinc-50 dark:bg-[var(--bg-color)]/50 border border-zinc-200 dark:border-[var(--glass-border)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--text-primary)] opacity-60 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] ml-1">Email cannot be changed currently.</p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full btn-primary py-4 text-sm font-semibold shadow-indigo-500/25 shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
