import React, { useState } from 'react';
import type { ProverbEntry } from '../types';

interface ProverbCardProps {
  entry: ProverbEntry;
}

export const ProverbCard: React.FC<ProverbCardProps> = ({ entry }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group [perspective:1000px] animate-fade-in-up cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-64 transition-transform duration-700 ease-out [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-pop-blue via-pop-pink to-pop-lime p-6 md:p-8 rounded-2xl shadow-comic border-2 border-black flex items-center justify-center text-center transition-shadow duration-300 group-hover:shadow-comic-hover group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-[-1deg] [backface-visibility:hidden]"
        >
          <h3 className="font-comic text-3xl md:text-[44px] leading-tight text-black drop-shadow-[3px_3px_0_rgba(255,255,255,0.7)] select-none">
            {entry.proverb && entry.proverb.trim().length > 0 ? entry.proverb : 'Untitled proverb'}
          </h3>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 bg-white dark:bg-slate-900 p-6 md:p-7 rounded-2xl shadow-comic border-2 border-black flex flex-col justify-between gap-4 [transform:rotateY(180deg)] [backface-visibility:hidden]"
        >
          <div className="flex-grow overflow-y-auto space-y-4">
            <section>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meaning</h5>
              <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {entry.meaning && entry.meaning.trim().length > 0 ? entry.meaning : 'Meaning not provided yet.'}
              </p>
            </section>
            <section>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">English Meaning</h5>
              <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-sans italic whitespace-pre-wrap">
                {entry.english_meaning && entry.english_meaning.trim().length > 0 ? entry.english_meaning : 'No English translation available.'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
