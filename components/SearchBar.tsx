
import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "စကားလုံး ရှာရန်..." }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <SearchIcon className="w-5 h-5 text-slate-500" />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-14 pr-5 py-3 text-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 border-2 border-black rounded-full shadow-comic focus:outline-none focus:ring-4 focus:ring-pop-lime dark:focus:ring-pop-lime focus:shadow-none transition-all duration-300 ease-in-out"
      />
    </div>
  );
};