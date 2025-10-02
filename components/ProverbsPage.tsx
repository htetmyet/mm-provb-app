
import React, { useState, useEffect, useMemo } from 'react';
import { ProverbEntry } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { SearchBar } from './SearchBar';
import { ProverbCard } from './ProverbCard';
import { loadProverbEntries } from '../data/sqlLoader';

export const ProverbsPage: React.FC = () => {
  const [proverbs, setProverbs] = useState<ProverbEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialProverbs, setInitialProverbs] = useState<ProverbEntry[]>([]);
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProverbs = async () => {
      try {
        const data = await loadProverbEntries();
        setProverbs(data);

        const candidates = data.filter(entry => {
          const hasProverb = entry.proverb && entry.proverb.trim().length > 0;
          const hasMeaning = entry.meaning && entry.meaning.trim().length > 0;
          const hasEnglish = entry.english_meaning && entry.english_meaning.trim().length > 0;
          return hasProverb && hasMeaning && hasEnglish;
        });
        const source = candidates.length > 0 ? candidates : data;
        if (source.length > 0) {
          const randomIndex = Math.floor(Math.random() * source.length);
          setInitialProverbs([source[randomIndex]]);
        } else {
          setInitialProverbs([]);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProverbs();
  }, []);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return [];
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    return proverbs
      .filter(entry => 
        entry.proverb.toLowerCase().includes(lowerCaseQuery) ||
        entry.meaning.toLowerCase().includes(lowerCaseQuery) ||
        (entry.english_meaning && entry.english_meaning.toLowerCase().includes(lowerCaseQuery))
      )
      .slice(0, 50);

  }, [searchQuery, proverbs]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const totalPages = searchQuery ? Math.max(1, Math.ceil(searchResults.length / ITEMS_PER_PAGE)) : 1;
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = searchQuery ? searchResults.slice(pageStart, pageStart + ITEMS_PER_PAGE) : initialProverbs;
  const proverbsToDisplay = searchQuery ? paginatedResults : initialProverbs;
  const showPagination = searchQuery && totalPages > 1;

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto mb-10">
        <SearchBar 
          value={searchQuery} 
          onChange={handleSearchChange}
          placeholder="စကားပုံ ရှာရန်..." 
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {!searchQuery && (
            <h2 className="font-comic text-3xl text-center mb-8 text-black dark:text-white font-bold animate-fade-in-up">
              Today's Proverb
            </h2>
          )}
          {proverbsToDisplay.length > 0 ? (
            <>
              <div className={searchQuery ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "max-w-xl mx-auto"}>
                {proverbsToDisplay.map((entry) => (
                  <ProverbCard key={entry.id} entry={entry} />
                ))}
              </div>
              {showPagination && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 border-2 border-black rounded-full bg-white dark:bg-slate-800 text-black dark:text-white font-comic disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={safePage === 1}
                  >
                    Previous
                  </button>
                  <span className="font-comic text-lg">
                    Page {safePage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 border-2 border-black rounded-full bg-pop-lime text-black font-comic disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={safePage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            searchQuery && (
              <div className="text-center py-16 animate-fade-in-up">
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  No proverbs found for "{searchQuery}".
                </p>
              </div>
            )
          )}
        </>
      )}
    </main>
  );
};
