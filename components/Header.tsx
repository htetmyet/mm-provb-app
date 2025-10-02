
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { BookIcon } from './icons/BookIcon';
import { QuillIcon } from './icons/QuillIcon';

interface HeaderProps {
  currentPage: 'dictionary' | 'proverbs';
  onNavigate: (page: 'dictionary' | 'proverbs') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const commonButtonClasses = "flex items-center gap-2 px-4 py-2 font-comic text-lg font-bold border-2 border-black rounded-full transition-all duration-200";
  const activeButtonClasses = "bg-pop-lime text-black shadow-comic -translate-y-1";
  const inactiveButtonClasses = "bg-black/20 text-white hover:bg-pop-lime hover:text-black";

  return (
    <header className="sticky top-0 z-50 bg-pop-blue dark:bg-pop-bg-dark border-b-4 border-black py-3">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-pop-lime rounded-full p-2 border-2 border-black">
              <BookIcon className="w-6 h-6 text-black"/>
             </div>
            <span className="font-comic text-xl font-bold text-black dark:text-white hidden sm:block tracking-wide">
              Myanmar PocketBook
            </span>
          </div>

          <nav className="flex items-center gap-2 p-1 bg-black/30 rounded-full">
             <button
              onClick={() => onNavigate('dictionary')}
              className={`${commonButtonClasses} ${currentPage === 'dictionary' ? activeButtonClasses : inactiveButtonClasses}`}
            >
              <BookIcon className="w-5 h-5" />
              Dictionary
            </button>
            <button
              onClick={() => onNavigate('proverbs')}
              className={`${commonButtonClasses} ${currentPage === 'proverbs' ? activeButtonClasses : inactiveButtonClasses}`}
            >
              <QuillIcon className="w-5 h-5"/>
              Proverbs
            </button>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};