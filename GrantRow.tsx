import React from 'react';
import { GlassCard } from './GlassCard';
import { User, Search, Zap, X } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleAiSearch: () => void;
  clearAiFilter: () => void;
  isAiFiltering: boolean;
  isProcessingAi: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  handleAiSearch, 
  clearAiFilter, 
  isAiFiltering, 
  isProcessingAi 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-0 transition-all duration-300">
      <div className="w-full pointer-events-auto">
        <header className="flex items-center justify-between px-4 lg:px-8 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          
          {/* Left: Brand */}
          <div className="flex items-center shrink-0 w-auto lg:w-[240px]">
            <h1 className="text-[15px] font-black text-gray-900 dark:text-white">
              fundlookup
            </h1>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                className="block w-full pl-10 pr-10 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/20 transition-all text-[13px] outline-none"
                placeholder="Search grants, VCs, funds..."
              />
              {/* AI Trigger */}
              <div className="absolute inset-y-0 right-1 flex items-center">
                {isAiFiltering ? (
                  <button 
                    onClick={clearAiFilter}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={handleAiSearch}
                    disabled={isProcessingAi || !searchQuery}
                    className={`p-2 rounded-full transition-colors ${searchQuery ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10' : 'text-gray-300 dark:text-gray-600'}`}
                  >
                    <Zap className={`w-4 h-4 ${isProcessingAi ? 'animate-pulse' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: User Profile */}
          <div className="hidden lg:flex items-center justify-end shrink-0 w-[240px]">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <span className="text-[13px] font-semibold text-gray-600 dark:text-gray-400">Account</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 overflow-hidden">
                <User className="w-4 h-4" />
              </div>
            </button>
          </div>

        </header>
      </div>
    </nav>
  );
};
