import React from 'react';
import {
    PlusCircle,
    History,
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock,
    LayoutDashboard
} from 'lucide-react';

const Sidebar = ({ dissState, savedDissertations, onBack, onLoadDissertation, onStartNew }) => {
    const chapters = Object.entries(dissState.chapters);

    return (
        <aside className="w-64 h-full border-r border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0d0d0f] flex flex-col z-30 shrink-0">
            {/* Header / Brand */}
            <div className="p-4 border-b border-zinc-200 dark:border-white/5">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-400 dark:text-white/40 hover:text-zinc-800 dark:hover:text-white transition-colors mb-4 text-xs font-medium group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                        <BookOpen size={16} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold font-outfit text-[var(--text-primary)]">Anonemasi</h1>
                        <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Dissertation Pro</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-5">
                {/* New Session */}
                <button
                    onClick={onStartNew}
                    className="w-full p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center gap-2.5 group text-sm font-bold"
                >
                    <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300 shrink-0" />
                    New Dissertation
                </button>

                {/* Current Progress */}
                {dissState.topic && (
                    <div className="space-y-2">
                        <h3 className="text-[9px] font-bold text-zinc-400 dark:text-white/20 uppercase tracking-[0.2em] px-1 flex items-center gap-1.5">
                            <Clock size={10} />
                            Active Project
                        </h3>
                        <p className="text-[10px] text-[var(--text-secondary)] px-1 line-clamp-2 leading-relaxed mb-2">{dissState.topic}</p>
                        <div className="space-y-0.5">
                            {chapters.map(([num, chapter]) => {
                                const isActive = parseInt(num) === dissState.currentChapter;
                                const isCompleted = chapter.approved;

                                return (
                                    <button
                                        key={num}
                                        className={`w-full px-2.5 py-2 rounded-lg flex items-center gap-2.5 transition-all text-left group ${isActive
                                                ? 'bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-[var(--text-primary)]'
                                                : 'text-zinc-500 dark:text-white/40 hover:text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-mono border shrink-0 ${isActive
                                                ? 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-400'
                                                : isCompleted
                                                    ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400'
                                                    : 'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/5 text-zinc-400 dark:text-white/20'
                                            }`}>
                                            {isCompleted ? <CheckCircle2 size={10} /> : num}
                                        </div>
                                        <span className="text-[11px] font-medium truncate flex-1">{chapter.title}</span>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Saved Projects */}
                {savedDissertations?.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-[9px] font-bold text-zinc-400 dark:text-white/20 uppercase tracking-[0.2em] px-1 flex items-center gap-1.5">
                            <History size={10} />
                            Saved Assignments
                        </h3>
                        <div className="space-y-1">
                            {savedDissertations.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onLoadDissertation(item.id)}
                                    className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all text-left active:scale-[0.98] group"
                                >
                                    <p className="text-[11px] font-bold text-[var(--text-primary)] line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-0.5">{item.topic}</p>
                                    <p className="text-[9px] text-[var(--text-secondary)] flex items-center gap-1">
                                        <LayoutDashboard size={9} />
                                        {item.program}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-200 dark:border-white/5">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <PlusCircle size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-[var(--text-primary)]">Upgrade Pro</p>
                        <p className="text-[9px] text-[var(--text-secondary)] truncate">Get unlimited AI writing</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
