
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="bg-pop-lime border-2 border-black shadow-comic rounded-xl px-8 py-4 animate-fade-in-up">
      <div className="flex items-center justify-center space-x-2">
        <h3 className="font-comic text-2xl font-bold text-black uppercase tracking-widest">Loading</h3>
        <div className="flex items-end space-x-1">
          <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};