import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ChevronLeft,
  DollarSign
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ToolLandingPage = ({ tool }) => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans selection:bg-indigo-500/30 transition-colors duration-500 overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br ${tool.color} rounded-full blur-[140px] dark:opacity-30 opacity-20`} 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br ${tool.color} rounded-full blur-[140px] dark:opacity-25 opacity-15`} 
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
      </div>

      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-black/40 border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
           <Link to="/" className="flex items-center gap-2 group">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl font-outfit tracking-tight">Anonemasi</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#pricing" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Pricing</a>
            <a href="#features" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-40 lg:pt-48 relative">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-12 group"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50 dark:bg-white/5 border border-[var(--glass-border)] group-hover:border-indigo-500/50 transition-all">
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to all tools
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-10"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 backdrop-blur-xl bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">Premium AI Tool</span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--text-primary)]"
              >
                {tool.title}
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed max-w-2xl font-medium"
              >
                {tool.longDescription || tool.description}
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="space-y-5 pt-4">
              {tool.features && tool.features.map((feature, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 text-[var(--text-primary)] group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center border border-current opacity-20 group-hover:opacity-100 transition-opacity`}>
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                  <span className="text-lg font-medium opacity-80 group-hover:opacity-100 transition-opacity">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8">
              <Link
                to={`${tool.link}/app`}
                className={`btn-primary text-xl px-12 py-6 w-full sm:w-auto shadow-2xl transition-all hover:scale-105 bg-gradient-to-r ${tool.color} border-none text-white font-bold group`}
              >
                Launch {tool.title}
                <ArrowRight className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-4 text-sm text-[var(--text-secondary)] font-medium">No installation required • Runs in your browser</p>
            </motion.div>
          </motion.div>

          {/* Right Column: Pricing & Benefits Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-5 relative"
            id="pricing"
          >
            <div className={`absolute inset-0 bg-gradient-to-tr ${tool.color} opacity-10 rounded-[2.5rem] blur-3xl transform rotate-3 -z-10`} />
            
            <div className="glass-panel border-2 border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden backdrop-blur-3xl bg-white/80 dark:bg-black/60 shadow-2xl group hover:border-indigo-500/30 transition-colors duration-500">
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Pricing Strategy</div>
                  <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-wider">Most Flexible</div>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold font-outfit">Pay With Tokens</h3>
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${tool.color}`}>
                        {tool.price}
                      </span>
                      <span className="text-sm font-bold text-[var(--text-secondary)]">Tokens</span>
                    </div>
                    <span className="text-[10px] font-medium text-[var(--text-secondary)]">Per Generation</span>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-6 leading-relaxed bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-[var(--glass-border)]">
                  {tool.priceNotice || "Access complete power by using your token balance. Simply recharge when you need more."}
                </p>
              </div>

              <div className="space-y-6 mb-12">
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4">Enterprise-Grade Features</div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Zap size={20} className="text-yellow-500" />, title: "Turbo Speed", desc: "Results in < 10s" },
                    { icon: <ShieldCheck size={20} className="text-green-500" />, title: "Secure", desc: "Private data" },
                    { icon: <Clock size={20} className="text-indigo-500" />, title: "24/7 Access", desc: "Always on" },
                    { icon: <DollarSign size={20} className="text-purple-500" />, title: "Fair Price", desc: "No hidden fees" }
                  ].map((benefit, idx) => (
                    <div key={idx} className="p-4 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 flex flex-col gap-3 hover:bg-white transition-colors dark:hover:bg-white/10 group/item">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/40 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform">
                        {benefit.icon}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{benefit.title}</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">{benefit.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Preview Mockup */}
              <div className="relative group/preview cursor-default">
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 flex justify-between items-center">
                  <span>Output Preview</span>
                  <span className="text-indigo-500 flex items-center gap-1 group-hover/preview:translate-x-1 transition-transform animate-pulse text-[9px]">Live Preview <ArrowRight size={8} /></span>
                </div>
                <div className="bg-white dark:bg-[#050505] rounded-3xl p-6 border-2 border-dashed border-[var(--glass-border)] group-hover:border-indigo-500/40 transition-all font-serif text-[10px] space-y-4 max-h-48 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-[#050505] to-transparent z-10" />
                  
                  <div className="flex justify-between border-b border-zinc-100 dark:border-white/10 pb-2 mb-4 font-bold text-xs uppercase tracking-tighter">
                    <span className="text-indigo-500">Academic Report</span>
                    <span className="text-zinc-400">Page 1 of 12</span>
                  </div>
                  <div className="space-y-3 opacity-60">
                    <div className="h-2 w-full bg-zinc-100 dark:bg-white/10 rounded" />
                    <div className="h-2 w-5/6 bg-zinc-100 dark:bg-white/10 rounded" />
                    <div className="h-2 w-11/12 bg-zinc-100 dark:bg-white/10 rounded" />
                    <div className="pt-2 h-2 w-full bg-zinc-100 dark:bg-white/10 rounded" />
                    <div className="h-2 w-3/4 bg-zinc-100 dark:bg-white/10 rounded" />
                    <div className="h-2 w-4/6 bg-zinc-100 dark:bg-white/10 rounded" />
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="mt-10 p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2">
                  <Sparkles size={12} className="text-indigo-500 opacity-50" />
                </div>
                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">Risk-Free Trial</div>
                <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">
                  Your first generation is completely <span className="text-indigo-500 dark:text-indigo-400 font-bold">FREE</span>. 
                  Experience the magic before you buy tokens.
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="mt-20 border-t border-[var(--glass-border)] py-12 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg font-outfit">Anonemasi</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-medium">© 2026 Anonemasi AI. Built for Academic Excellence.</p>
          <div className="flex gap-6 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Safety</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ToolLandingPage;
