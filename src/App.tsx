import React, { useState, useMemo, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GlassCard } from '../components/GlassCard';
import { FundRow } from '../components/FundRow';
import { FundDetail } from '../components/FundDetail';
import { ALL_FUNDS } from '../data/funds';
import { FundSource, FundStatus, FundingType } from '../types';
import { Search, Zap, ChevronDown, Star } from 'lucide-react';
import { filterFundsWithGemini } from '../services/geminiService';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ToggleSwitch: React.FC<{ id: string; checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ id, checked, onChange, label }) => (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer w-full">
        <span className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            <Star className={`w-4 h-4 transition-colors ${checked ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}`} />
            {label}
        </span>
        <div className="relative">
            <input 
                id={id}
                type="checkbox" 
                className="sr-only" 
                checked={checked} 
                onChange={(e) => onChange(e.target.checked)} 
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-[#505050]/20 dark:bg-white/10'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
        </div>
    </label>
);

const FilterSelect: React.FC<{id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]}> = ({id, label, value, onChange, options}) => (
    <div className="flex flex-col gap-3">
        <label htmlFor={id} className="text-[11px] text-gray-400 dark:text-gray-500 font-bold block">{label}</label>
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="w-full appearance-none bg-transparent border-0 border-b border-gray-100 dark:border-gray-800 rounded-none pb-2 text-[13px] font-bold text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
                {options.map((option) => (<option key={option} value={option} className="text-gray-900 bg-white dark:bg-gray-900">{option}</option>))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-300"><ChevronDown className="h-3 w-3" /></div>
        </div>
    </div>
);

const CATEGORIES = ['All', 'Grants & Schemes', 'VC Funding', 'Accelerators'];

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSector, setActiveSector] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<FundStatus | 'All'>('All');
  const [activeSource, setActiveSource] = useState<FundSource | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  
  // Favorites State
  const [favoriteFundIds, setFavoriteFundIds] = useLocalStorage<string[]>('favoriteFunds', []);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // AI Filtering State
  const [isAiFiltering, setIsAiFiltering] = useState(false);
  const [aiRelevantIds, setAiRelevantIds] = useState<string[] | null>(null);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // Memoize all unique sectors from the funds
  const allSectors = useMemo(() => {
    const sectors = new Set<string>();
    ALL_FUNDS.forEach(fund => fund.sectors.forEach(sector => sectors.add(sector)));
    return ['All', ...Array.from(sectors).sort()];
  }, []);

  // Derived filtered and sorted data
  const processedFunds = useMemo(() => {
    let funds = ALL_FUNDS;

    if (showFavoritesOnly) {
      funds = funds.filter(fund => favoriteFundIds.includes(fund.id));
    }

    funds = funds.filter(fund => {
      // Category Filter Logic
      if (activeCategory !== 'All') {
          if (activeCategory === 'VC Funding') {
              if (!fund.fundingType.includes(FundingType.EQUITY)) return false;
          } else if (activeCategory === 'Accelerators') {
             // Heuristic: Accelerators typically involve equity and early stage, or explicit mention
             // For now, return false as no data matches this strictly in sample
             return false; 
          } else if (activeCategory === 'Grants & Schemes') {
              // Exclude pure Equity plays
              if (fund.fundingType.includes(FundingType.EQUITY) && fund.fundingType.length === 1) return false;
          }
      }

      if (activeSector !== 'All' && !fund.sectors.includes(activeSector)) return false;
      if (activeStatus !== 'All' && fund.status !== activeStatus) return false;
      if (activeSource !== 'All' && fund.source !== activeSource) return false;
      
      if (aiRelevantIds !== null) {
        return aiRelevantIds.includes(fund.id);
      }

      if (searchQuery && !aiRelevantIds) {
        const q = searchQuery.toLowerCase();
        return (
          fund.title.toLowerCase().includes(q) ||
          fund.description.toLowerCase().includes(q) ||
          fund.sectors.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    funds.sort((a, b) => a.title.localeCompare(b.title));

    return funds;
  }, [activeCategory, activeSector, activeStatus, activeSource, searchQuery, aiRelevantIds, favoriteFundIds, showFavoritesOnly]);

  const selectedFund = useMemo(() => {
    if (selectedFundId) {
        return ALL_FUNDS.find(g => g.id === selectedFundId);
    }
    return undefined;
  }, [selectedFundId]);

  const handleAiSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsProcessingAi(true);
    setAiReasoning(null);
    setAiRelevantIds(null);
    setSelectedFundId(null);

    const { relevantIds, reasoning } = await filterFundsWithGemini(searchQuery, ALL_FUNDS);
    
    setAiRelevantIds(relevantIds);
    setAiReasoning(reasoning);
    setIsAiFiltering(true);
    setIsProcessingAi(false);
  }, [searchQuery, ALL_FUNDS]);

  const clearAiFilter = () => {
    setIsAiFiltering(false);
    setAiRelevantIds(null);
    setAiReasoning(null);
    setSearchQuery('');
  };

  const handleRowClick = (fundId: string) => {
    setSelectedFundId(fundId);
  };
  
  const resetAllFilters = () => {
    setActiveCategory('All');
    setActiveSector('All');
    setActiveStatus('All');
    setActiveSource('All');
    setSearchQuery('');
    clearAiFilter();
    setSelectedFundId(null);
    setShowFavoritesOnly(false);
  };

  const toggleFavorite = useCallback((fundId: string) => {
    setFavoriteFundIds(prevIds => {
      if (prevIds.includes(fundId)) {
        return prevIds.filter(id => id !== fundId);
      } else {
        return [...prevIds, fundId];
      }
    });
  }, [setFavoriteFundIds]);

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-hidden relative">
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleAiSearch={handleAiSearch}
        clearAiFilter={clearAiFilter}
        isAiFiltering={isAiFiltering}
        isProcessingAi={isProcessingAi}
      />

      <main className="flex-1 w-full pt-14 lg:pt-16 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          
          {/* Sidebar - Minimal Desktop Rail / Mobile Filter Bar */}
          <aside className="w-full lg:w-72 flex flex-col border-r border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shrink-0 overflow-y-auto custom-scrollbar">
            <div className="p-6 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-[13px] font-bold text-gray-900 dark:text-white">Filter View</h3>
                 {processedFunds.length < ALL_FUNDS.length && (
                    <button onClick={resetAllFilters} className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:opacity-80 font-bold">Reset</button>
                 )}
              </div>
              
              <div className="space-y-8">
                  <FilterSelect 
                      id="category-select"
                      label="Type"
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      options={CATEGORIES}
                  />
                  
                  <FilterSelect 
                      id="sector-select"
                      label="Industry"
                      value={activeSector}
                      onChange={(e) => setActiveSector(e.target.value)}
                      options={allSectors}
                  />

                  <div className="grid grid-cols-1 gap-8">
                    <FilterSelect 
                      id="status-select"
                      label="Timeline"
                      value={activeStatus}
                      onChange={(e) => setActiveStatus(e.target.value as FundStatus | 'All')}
                      options={['All', ...Object.values(FundStatus)]}
                    />

                    <FilterSelect 
                      id="source-select"
                      label="Origin"
                      value={activeSource}
                      onChange={(e) => setActiveSource(e.target.value as FundSource | 'All')}
                      options={['All', ...Object.values(FundSource)]}
                    />
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                      <ToggleSwitch 
                          id="favorites-toggle"
                          label="Starred"
                          checked={showFavoritesOnly}
                          onChange={setShowFavoritesOnly}
                      />
                  </div>
              </div>
            </div>
          </aside>
          
          {/* Content Area */}
          <section className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-gray-900">
            {isAiFiltering && aiReasoning && (
               <div className="px-6 py-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100/50 dark:border-indigo-500/10 text-[11px] text-indigo-600 dark:text-indigo-300/80 leading-relaxed animate-in fade-in slide-in-from-top-2">
                 <div className="flex items-center gap-2 mb-1.5 text-indigo-700 dark:text-indigo-400 font-bold text-[13px]"><Zap className="w-3.5 h-3.5" /><span>Analysis</span></div>
                 {aiReasoning}
               </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
              {selectedFund ? (
                <div className="h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                  <FundDetail 
                    fund={selectedFund} 
                    onBack={() => setSelectedFundId(null)}
                    isFavorite={favoriteFundIds.includes(selectedFund.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden h-full">
                  <div className="px-6 py-4 flex justify-between items-center bg-gray-50/50 dark:bg-transparent shrink-0">
                      <h2 className="font-bold text-gray-900 dark:text-white text-[13px]">
                          {processedFunds.length} Results
                      </h2>
                      <div className="flex gap-4">
                         {activeCategory !== 'All' && <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{activeCategory}</span>}
                         <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">
                            {activeSector !== 'All' ? activeSector : 'Global'}
                         </span>
                      </div>
                  </div>
                  
                  <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {processedFunds.length > 0 ? (
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 border-b border-gray-100 dark:border-gray-800">
                          <tr>
                            <th className="font-bold p-6 text-[11px] text-gray-400 dark:text-gray-500"></th>
                            <th className="font-bold p-6 text-[11px] text-gray-400 dark:text-gray-500">Name</th>
                            <th className="font-bold p-6 text-[11px] text-gray-400 dark:text-gray-500 hidden md:table-cell">Sectors</th>
                            <th className="font-bold p-6 text-[11px] text-gray-400 dark:text-gray-500 hidden lg:table-cell">Type</th>
                            <th className="font-bold p-6 text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">Amount</th>
                            <th className="font-bold p-6 text-[11px] text-gray-400 dark:text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                          {processedFunds.map(fund => (
                            <FundRow 
                                key={fund.id} 
                                fund={fund} 
                                onClick={handleRowClick}
                                isFavorite={favoriteFundIds.includes(fund.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                        <Search className="w-12 h-12 opacity-10 mb-4" />
                        <p className="text-[13px] font-medium">No matches found</p>
                        <button onClick={resetAllFilters} className="mt-4 text-[13px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Clear Filters</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;