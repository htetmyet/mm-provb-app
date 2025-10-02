
import React, { useState } from 'react';
import { Header } from './components/Header';
import { DictionaryPage } from './components/DictionaryPage';
import { ProverbsPage } from './components/ProverbsPage';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dictionary' | 'proverbs'>('dictionary');

  return (
    <div className="min-h-screen w-full bg-pop-bg-light dark:bg-pop-bg-dark text-slate-800 dark:text-slate-200 transition-colors duration-500 font-myanmar">
       <div className="min-h-screen w-full bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        
        {currentPage === 'dictionary' && <DictionaryPage />}
        {currentPage === 'proverbs' && <ProverbsPage />}

        <footer className="text-center py-6 text-sm text-slate-600 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} Myanmar PocketBook. All rights reserved.</p>
          <p className="mt-1">
            Data sourced from <a href="https://huggingface.co/Rickaym" target="_blank" rel="noopener noreferrer" className="underline hover:text-pop-blue transition-colors">Rickaym on Hugging Face</a>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
