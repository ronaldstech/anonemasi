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
      transition: { staggerChildren: 0.1 }
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
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br ${tool.color} rounded-full blur-[120px] opacity-20`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br ${tool.color} rounded-full blur-[120px] opacity-20`} />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 lg:py-28 relative">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-12 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to all tools
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 backdrop-blur-xl bg-indigo-50 dark:bg-indigo-950/60 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Advanced AI Technology</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]"
            >
              {tool.title}
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-xl"
            >
              {tool.longDescription || tool.description}
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-4">
              {tool.features && tool.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-[var(--text-primary)] font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <CheckCircle2 size={14} className="text-green-500" />
                  </div>
                  {feature}
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to={`${tool.link}/app`}
                className={`btn-primary text-lg px-10 py-5 w-full sm:w-auto shadow-2xl transition-all hover:scale-105 bg-gradient-to-r ${tool.color} border-none text-white`}
              >
                Start Using Tool
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Pricing & Benefits Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-[2.5rem] blur-3xl transform rotate-3" />
            
            <div className="glass-panel border border-[var(--glass-border)] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden backdrop-blur-3xl bg-white/90 dark:bg-[#0A0A0B]/80 shadow-2xl">
              <div className="mb-10">
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4">Pricing Model</div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold font-outfit">Pay Per Use</h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${tool.color}`}>
                      {tool.price}
                    </span>
                    <span className="text-sm font-bold text-[var(--text-secondary)]">MWK</span>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-4">
                  {tool.priceNotice || "One-time payment per generation. No monthly subscriptions required."}
                </p>
              </div>

              <div className="space-y-6">
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">What's Included</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 flex flex-col gap-3">
                    <Zap size={20} className="text-yellow-500" />
                    <div>
                      <div className="font-bold text-sm">Turbo Speed</div>
                      <div className="text-xs text-[var(--text-secondary)]">Results in seconds</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 flex flex-col gap-3">
                    <ShieldCheck size={20} className="text-green-500" />
                    <div>
                      <div className="font-bold text-sm">Safe & Confidential</div>
                      <div className="text-xs text-[var(--text-secondary)]">Your data is private</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 flex flex-col gap-3">
                    <Clock size={20} className="text-indigo-500" />
                    <div>
                      <div className="font-bold text-sm">24/7 Access</div>
                      <div className="text-xs text-[var(--text-secondary)]">Always available</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 flex flex-col gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">AI Pro Plus</div>
                      <div className="text-xs text-[var(--text-secondary)]">Latest GPT-4o models</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Preview Mockup */}
              <div className="mt-10 pt-10 border-t border-[var(--glass-border)]">
                <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6">Generated Sample</div>
                <div className="bg-zinc-50 dark:bg-black/40 rounded-2xl p-6 border border-zinc-100 dark:border-white/5 font-serif text-[10px] space-y-4 opacity-80 group-hover:opacity-100 transition-opacity max-h-60 overflow-hidden relative">
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-50 dark:from-[#0A0A0B] to-transparent z-10" />
                  
                  <div className="border-b pb-2 mb-4 font-bold text-xs">References & Bibliography</div>
                  <div className="space-y-3">
                    <p className="indent-[-12px] pl-3">1. Amateur Radio Relay League (ARRL), "Amateur Radio," [Online]. Available: http://www.arrl.org/amateur-radio</p>
                    <p className="indent-[-12px] pl-3">2. Richard A. Thompson, "Digital Telephony as an Integrated Service," Singapore, 2006.</p>
                    <p className="indent-[-12px] pl-3">3. L. Zhang, "Development of ZigBee technology based on smart home system," IEEE Conference, Beijing, 2011.</p>
                    <p className="indent-[-12px] pl-3">4. K. Choi, "Design and implementation of ZigBee-based smart power monitoring," ICOIN, 2014.</p>
                    <p className="indent-[-12px] pl-3">5. M. Al-Qutayri, "ZigBee-based home energy management system," ICCSN, Xi'an China, 2011.</p>
                    <p className="indent-[-12px] pl-3">6. B. A. Kumar, "ZigBee based home automation system using Android," IEEE Control System Conf, 2012.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-5 rounded-3xl bg-indigo-600/5 border border-indigo-500/20 text-center">
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">First Document is Free!</div>
                <div className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                  Try it out without any cost. Your first generation is on us, shared across all tools.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ToolLandingPage;
