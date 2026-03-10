import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Presentation,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Sun,
  Moon,
  Zap,
  Clock,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import DissertationTool from './pages/DissertationTool';
import EssayTool from './pages/EssayTool';

const tools = [
  {
    id: 'dissertation',
    title: 'Dissertation Pro',
    description: 'Expert guidance and structuring for your final year dissertation.',
    icon: <BookOpen className="w-8 h-8 text-indigo-400 group-hover:text-white transition-colors duration-300" />,
    color: 'from-indigo-500 to-indigo-600',
    link: '/dissertation'
  },
  {
    id: 'essay',
    title: 'Essay Weaver',
    description: 'Craft compelling essays with advanced AI-assisted writing tools.',
    icon: <FileText className="w-8 h-8 text-purple-400 group-hover:text-white transition-colors duration-300" />,
    color: 'from-purple-500 to-purple-600',
    link: '/essay'
  },
  {
    id: 'powerpoint',
    title: 'Presentation Gen',
    description: 'Generate stunning, structured PowerPoint presentations instantly.',
    icon: <Presentation className="w-8 h-8 text-pink-400 group-hover:text-white transition-colors duration-300" />,
    color: 'from-pink-500 to-pink-600',
    link: '/powerpoint'
  }
];

const benefits = [
  { icon: <Clock className="w-6 h-6 text-indigo-400" />, title: "Save 10x Time", desc: "Automate outlining, formatting, and structuring." },
  { icon: <Zap className="w-6 h-6 text-purple-400" />, title: "Instant AI Ideas", desc: "Overcome writer's block instantly with smart suggestions." },
  { icon: <CheckCircle2 className="w-6 h-6 text-pink-400" />, title: "Higher Grades", desc: "Produce logically sound, well-researched academic work." }
];

function LandingPage() {
  const { currentUser, logout } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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
    <div className="min-h-screen text-[var(--text-primary)] font-sans relative transition-colors duration-300 overflow-x-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/15 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[35%] h-[55%] bg-purple-600/15 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[20%] w-[45%] h-[45%] bg-pink-600/15 rounded-full blur-[120px] mix-blend-screen"
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/90 dark:bg-black/40 border-b border-[var(--glass-border)] shadow-sm dark:shadow-none"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-outfit tracking-tight text-[var(--text-primary)]">Anonemasi</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
            <a href="#benefits" className="hover:text-[var(--text-primary)] transition-colors">Benefits</a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--glass-border)] transition-colors text-[var(--text-primary)]"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="px-3 hover:text-[var(--text-primary)] transition-colors">Dashboard</Link>
                <div className="relative group p-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 cursor-pointer">
                    <div className="w-full h-full bg-[var(--bg-color)] rounded-full flex items-center justify-center text-xs font-bold font-outfit text-[var(--accent-primary)]">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  {/* Dropdown via hover */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-[#121212] border border-[var(--glass-border)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 glass-panel">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm">Profile Settings</Link>
                    <button onClick={() => logout()} className="w-full text-left block px-4 py-2 hover:bg-red-500/10 text-red-500 transition-colors text-sm">Sign out</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-5 py-2">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm px-5 py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--glass-border)] transition-colors text-[var(--text-primary)]"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--glass-border)] transition-colors text-[var(--text-primary)]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-[var(--glass-border)] overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4 text-center">
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2"
                >
                  Features
                </a>
                <a
                  href="#benefits"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2"
                >
                  Benefits
                </a>
                <div className="h-px w-full bg-[var(--glass-border)] my-2"></div>
                {currentUser ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary w-full justify-center mb-2">Profile</Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="btn-secondary w-full justify-center text-red-500 border-red-500/30 hover:bg-red-500/10">Sign out</button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-secondary w-full justify-center mb-2"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-primary w-full justify-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 relative"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          {/* Floating UI elements */}
          <motion.div className="hidden md:block absolute top-[10%] left-[-10%] animate-float p-4 rounded-2xl w-52 text-left shadow-2xl z-10 border border-[var(--glass-border)] bg-white/90 dark:bg-[#1a1a2e]/90 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center">
                <FileText className="w-3 h-3 text-indigo-500" />
              </div>
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">AI Draft</span>
            </div>
            <div className="h-1.5 w-10 bg-indigo-500 rounded-full mb-2"></div>
            <div className="h-1.5 w-full bg-[var(--text-secondary)] rounded-full mb-2 opacity-30"></div>
            <div className="h-1.5 w-3/4 bg-[var(--text-secondary)] rounded-full opacity-20"></div>
            <div className="h-1.5 w-5/6 bg-[var(--text-secondary)] rounded-full mt-2 opacity-20"></div>
          </motion.div>

          <motion.div className="hidden md:flex absolute bottom-[10%] right-[-10%] animate-float-reverse items-center gap-3 shadow-2xl z-10 px-4 py-2.5 rounded-2xl border border-green-500/20 bg-white/90 dark:bg-[#0d1f17]/90 backdrop-blur-xl">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">Essay Generated!</p>
              <p className="text-[10px] text-green-500 dark:text-green-400">Ready to download</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 backdrop-blur-xl bg-indigo-50 dark:bg-indigo-950/60 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">The Next Generation of Student AI</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-[var(--text-primary)]">
            Elevate your academic <br className="hidden md:block" />
            <span className="text-gradient-accent relative inline-block group cursor-default">
              potential with AI.
              <motion.span
                className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                layoutId="underline"
              />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Anonemasi providing premium AI tools designed specifically for students.
            Craft perfect essays, structure dissertations, and generate stunning presentations effortlessly.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5 pt-6 w-full sm:w-auto relative z-20">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-5 w-full sm:w-auto shadow-indigo-500/30 shadow-2xl text-white font-semibold flex-1 justify-center whitespace-nowrap"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-5 w-full sm:w-auto shadow-indigo-500/30 shadow-2xl text-white font-semibold flex-1 justify-center whitespace-nowrap"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            )}
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
              className="btn-secondary text-lg px-8 py-5 w-full sm:w-auto text-[var(--text-primary)] font-medium flex-1 backdrop-blur-xl flex items-center justify-center whitespace-nowrap dark:hover:bg-white/10"
            >
              Explore Tools
            </motion.a>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-8 flex items-center gap-4 text-sm text-[var(--text-secondary)] font-medium">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-[var(--bg-color)] shadow-sm" />
              ))}
            </div>
            <div className="flex flex-col items-start border-l border-[var(--glass-border)] pl-4">
              <div className="flex text-yellow-500">
                {'★★★★★'}
              </div>
              <span>Join 5,000+ top students</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Tools Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          id="features"
          className="mt-40 pt-20"
        >
          <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold mb-4 text-[var(--text-primary)] font-outfit tracking-tight">Powerful tools for every task</motion.h2>
            <motion.p variants={itemVariants} className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">Select a tool below to supercharge your academic workflow.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`gradient-border-item p-8 rounded-3xl glass-panel group relative overflow-hidden backdrop-blur-2xl bg-white/90 dark:bg-[#0A0A0B]/80 hover:shadow-2xl hover:shadow-${tool.color.split('-')[1]}-500/20`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-150 group-hover:-rotate-12">
                  {tool.icon}
                </div>

                <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center bg-gradient-to-br ${tool.color} bg-opacity-10 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-inner overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-white/40 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {tool.icon}
                </div>

                <h3 className="text-2xl font-bold mb-3 font-outfit text-[var(--text-primary)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--text-primary)] group-hover:to-[var(--text-secondary)] transition-all">{tool.title}</h3>
                <p className="text-[var(--text-secondary)] mb-10 leading-relaxed group-hover:text-[var(--text-primary)]/80 transition-colors">{tool.description}</p>

                <Link to={tool.link} className={`inline-flex items-center text-sm font-bold text-[var(--text-primary)] transition-all border border-zinc-200 dark:border-[var(--glass-border)] rounded-full px-5 py-2.5 bg-zinc-50 dark:bg-black/30 group-hover:border-transparent group-hover:text-white relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity -z-10`} />
                  Open Tool
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          id="benefits"
          className="mt-40 border-t border-[var(--glass-border)] pt-32"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-[var(--text-primary)] font-outfit tracking-tight">Why choose <br /><span className="text-gradient-accent">Anonemasi?</span></h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                We bridge the gap between human creativity and artificial intelligence, tailored specifically for academic success. Our models are trained on academic structures to ensure rigor and formatting.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-[var(--glass-border)] transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-[var(--glass-border)]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-black/40 border border-zinc-200 dark:border-[var(--glass-border)] flex items-center justify-center shrink-0 shadow-sm">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[var(--text-primary)] mb-1 font-outfit">{benefit.title}</h4>
                      <p className="text-[var(--text-secondary)]">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl transform -rotate-6" />
              <div className="glass-panel border border-[var(--glass-border)] rounded-3xl p-8 relative overflow-hidden backdrop-blur-3xl bg-white/90 dark:bg-black/40 shadow-xl dark:shadow-none">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                      <div className="w-full h-full bg-white/80 dark:bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">AI Assistant</div>
                      <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400"></span> Online</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--text-secondary)]/10 dark:bg-[var(--text-secondary)]/20" />
                    <div className="bg-zinc-100 dark:bg-white/10 p-4 rounded-2xl rounded-tl-sm text-sm text-[var(--text-primary)]">
                      Can you help me outline my dissertation on Machine Learning in Healthcare?
                    </div>
                  </div>
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center"><Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /></div>
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4 rounded-2xl rounded-tr-sm text-sm text-[var(--text-primary)] shadow-sm dark:shadow-none">
                      <p className="mb-2 font-medium">Absolutely! Here is a comprehensive structure for your dissertation:</p>
                      <ul className="list-disc pl-4 space-y-1 text-indigo-700 dark:text-indigo-300">
                        <li>Abstract & Executive Summary</li>
                        <li>Introduction to ML paradigms</li>
                        <li>Literature Review on Medical AI</li>
                        <li>Methodology & Data Ethics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex items-center gap-3">
                  <div className="h-10 w-full bg-zinc-50 dark:bg-white/5 border border-[var(--glass-border)] rounded-full px-4 flex items-center text-sm text-[var(--text-secondary)] shadow-inner dark:shadow-none">
                    Type your topic here...
                  </div>
                  <div className="h-10 w-10 shrink-0 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-600 cursor-pointer transition-colors shadow-lg shadow-indigo-500/30">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)] py-16 mt-32 relative overflow-hidden bg-black/5 dark:bg-black/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-30" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-3 text-[var(--text-primary)] group">
            <div className="w-10 h-10 rounded-xl bg-[var(--glass-border)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <span className="font-extrabold text-xl font-outfit tracking-tight">Anonemasi</span>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
          </div>

          <p className="text-[var(--text-secondary)] text-sm">© 2026 Anonemasi AI. Empowering students worldwide.</p>
        </div>
      </footer>
    </div>
  );
}

import PowerPointTool from './pages/PowerPointTool';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        {/* Tool routes */}
        <Route path="/dissertation" element={<DissertationTool />} />
        <Route path="/essay" element={<EssayTool />} />
        <Route path="/powerpoint" element={<PowerPointTool />} />
      </Routes>
    </Router>
  );
}

export default App;
