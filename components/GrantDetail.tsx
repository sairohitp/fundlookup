import React from 'react';
import { GlassCard } from './GlassCard';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full flex justify-center py-2 px-2 lg:px-4 pointer-events-none shrink-0 z-50">
      <div className="w-full max-w-[1600px] mx-auto pointer-events-auto">
        <GlassCard className="px-6 py-2 min-h-9 flex flex-col md:flex-row items-center justify-between text-gray-500 text-[10px] lg:text-xs gap-3 shadow-lg">
          <div className="font-medium tracking-wide">
            &copy; 2024 fundlookup. All rights reserved.
          </div>
          <div className="flex gap-4 lg:gap-6">
            <a href="#" className="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">Support</a>
          </div>
        </GlassCard>
      </div>
    </footer>
  );
};