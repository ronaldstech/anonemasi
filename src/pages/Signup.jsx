import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        try {
            setLoading(true);
            await signup(email, password, name);
            console.log('Successfully signed up and stored in Firestore');
            navigate('/'); // Redirect to dashboard/home after successful signup
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to create an account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to sign up with Google');
        } finally {
            setLoading(false);
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

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans relative flex items-center justify-center p-6 overflow-hidden transition-colors duration-300">
            {/* Background ambient light */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/15 rounded-full blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-600/15 rounded-full blur-[120px] mix-blend-screen"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10"
            >
                <div className="absolute -inset-1 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-20 dark:opacity-40 animate-pulse-glow pointer-events-none" />

                <div className="glass-panel p-10 rounded-[2rem] border border-[var(--glass-border)] relative backdrop-blur-3xl bg-white/60 dark:bg-black/40 shadow-2xl">
                    <motion.div variants={itemVariants} className="flex justify-center mb-6">
                        <Link to="/" className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center mb-6">
                        <h2 className="text-3xl font-extrabold mb-2 font-outfit tracking-tight">Create Account</h2>
                        <p className="text-[var(--text-secondary)]">Join Anonemasi to supercharge your studies.</p>
                    </motion.div>

                    {error && (
                        <motion.div variants={itemVariants} className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div variants={itemVariants} className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Full Name</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-4 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/40 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner dark:shadow-none"
                                    placeholder="Jane Doe"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Email address</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/40 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner dark:shadow-none"
                                    placeholder="name@university.edu"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Password</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 text-[var(--text-secondary)] pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/40 dark:bg-white/5 border border-[var(--glass-border)] rounded-xl py-3 pl-12 pr-12 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner dark:shadow-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-3.5 text-lg font-semibold shadow-purple-500/25 shadow-xl flex items-center justify-center gap-2 group transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Sign up free
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center gap-4">
                        <div className="flex-1 h-px bg-[var(--glass-border)]"></div>
                        <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Or</span>
                        <div className="flex-1 h-px bg-[var(--glass-border)]"></div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-6">
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--glass-border)] bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-sm font-semibold">Sign up with Google</span>
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-[var(--text-secondary)]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-500 font-semibold hover:text-purple-400 transition-colors">
                            Sign in
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
