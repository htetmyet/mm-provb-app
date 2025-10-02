
import React, { useState, useEffect, useMemo } from 'react';
import { DictionaryEntry } from '../types';
import { loadDictionaryEntries } from '../data/sqlLoader';
import { LoadingSpinner } from './LoadingSpinner';
import { SearchBar } from './SearchBar';
import { WordCard } from './WordCard';

// Levenshtein distance function for fuzzy search
const levenshtein = (s1: string, s2: string): number => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = new Array(s2.length + 1);
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
};

export const DictionaryPage: React.FC = () => {
  const ITEMS_PER_PAGE = 15;
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialWords, setInitialWords] = useState<DictionaryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const data = await loadDictionaryEntries();
        setDictionary(data);

        const validEntries = data.filter(entry => {
          const requiredFields = [
            entry.alphabet,
            entry.word,
            entry.phonetics,
            entry.meaning,
            entry.pos,
            entry.origin,
          ];
          return requiredFields.every(field => field && field.toString().trim().length > 0);
        });

        const source = validEntries.length > 0 ? validEntries : data;
        if (source.length > 0) {
          const randomEntry = source[Math.floor(Math.random() * source.length)];
          setInitialWords([randomEntry]);
        } else {
          setInitialWords([]);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDictionary();
  }, []);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return [];
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    return dictionary
      .map(entry => {
        const word = entry.word.toLowerCase();
        let score = 0;

        if (word === lowerCaseQuery) {
          score = 100; // Perfect match
        } else if (word.startsWith(lowerCaseQuery)) {
          score = 50; // Starts with
        } else {
          const distance = levenshtein(word, lowerCaseQuery);
          if (distance <= 2) { // Allow up to 2 typos for close matches
            score = 30 - distance * 10;
          } else if (word.includes(lowerCaseQuery)) {
            score = 5; // Contains
          }
        }
        return { ...entry, score };
      })
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Limit to top 50 results

  }, [searchQuery, dictionary]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const totalPages = searchQuery ? Math.max(1, Math.ceil(searchResults.length / ITEMS_PER_PAGE)) : 1;
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = searchQuery ? searchResults.slice(pageStart, pageStart + ITEMS_PER_PAGE) : initialWords;
  const wordsToDisplay = searchQuery ? paginatedResults : initialWords;
  const showPagination = searchQuery && totalPages > 1;

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto mb-10">
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {!searchQuery && (
            <h2 className="font-comic text-3xl text-center mb-8 text-black dark:text-white font-bold animate-fade-in-up">
              Word of the Day
            </h2>
          )}
          {wordsToDisplay.length > 0 ? (
            <>
              <div className={searchQuery ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "max-w-md mx-auto"}>
                {wordsToDisplay.map((entry, index) => (
                  <WordCard key={`${entry.word}-${index}`} entry={entry} />
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
                  No results found for "{searchQuery}".
                </p>
              </div>
            )
          )}
        </>
      )}
    </main>
  );
};
