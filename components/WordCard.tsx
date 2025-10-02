import React from 'react';
import type { DictionaryEntry } from '../types';

interface WordCardProps {
  entry: DictionaryEntry;
}

export const WordCard: React.FC<WordCardProps> = ({ entry }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-comic border-2 border-black transition-all duration-300 ease-in-out hover:shadow-comic-hover hover:-translate-y-2 hover:scale-105 hover:rotate-[-2deg] animate-fade-in-up">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-3xl font-bold text-black dark:text-white">{entry.word}</h3>
          <p className="text-slate-600 dark:text-slate-400 font-sans">{entry.phonetics}</p>
        </div>
        <div className="text-5xl font-bold text-slate-200 dark:text-slate-700 select-none">{entry.alphabet}</div>
      </div>
      
      <div className="mt-4 border-t-2 border-slate-200 dark:border-slate-700 pt-4">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{entry.meaning}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold">
        <span className="bg-pop-lime border border-black text-black px-3 py-1 rounded-full">{entry.pos}</span>
        <span className="bg-pop-pink border border-black text-black px-3 py-1 rounded-full">{entry.origin}</span>
      </div>
    </div>
  );
};