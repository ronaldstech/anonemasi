import React from 'react';
import { ChevronRight } from 'lucide-react';

const steps = [
    { id: 1, label: 'Ch. 1' },
    { id: 2, label: 'Ch. 2' },
    { id: 3, label: 'Ch. 3' },
    { id: 4, label: 'Ch. 4' },
    { id: 5, label: 'Ch. 5' },
];

const ChapterTracker = ({ currentChapter = 0 }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                    {currentChapter > 0 ? `Chapter ${currentChapter}` : 'Topic Selection'}
                </span>
            </div>

            <div className="hidden md:block h-3.5 w-px bg-[var(--glass-border)] mx-1" />

            <div className="hidden md:flex items-center gap-1.5">
                {steps.map((step, i) => (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-1">
                            <div className={`w-4.5 h-4 px-1.5 rounded flex items-center justify-center text-[9px] font-bold transition-all ${i + 1 < currentChapter
                                ? 'bg-green-500/15 border border-green-500/30 text-green-500 dark:text-green-400'
                                : i + 1 === currentChapter
                                    ? 'bg-indigo-500/15 border border-indigo-500/40 text-indigo-500 dark:text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.25)]'
                                    : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] opacity-50'
                                }`}>
                                {i + 1}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider transition-all hidden sm:block ${i + 1 <= currentChapter ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-40'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <ChevronRight size={10} className="text-[var(--glass-border)] opacity-60" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ChapterTracker;
