import React from 'react';
import { Fund, FundStatus } from '../types';
import { getIconForSectors } from '../data/constants';
import { Landmark, Star } from 'lucide-react';

interface FundRowProps {
  fund: Fund;
  onClick: (fundId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (fundId: string) => void;
}

export const FundRow: React.FC<FundRowProps> = ({ fund, onClick, isFavorite, onToggleFavorite }) => {
  const Icon = getIconForSectors(fund.sectors);

  const statusStyles: { [key in FundStatus]: string } = {
    [FundStatus.OPEN]: 'text-emerald-600 dark:text-emerald-400',
    [FundStatus.CLOSING_SOON]: 'text-amber-600 dark:text-amber-400',
    [FundStatus.CLOSED]: 'text-rose-600 dark:text-rose-400',
    [FundStatus.WAITLIST]: 'text-blue-600 dark:text-blue-400',
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(fund.id);
  }

  return (
    <tr 
      onClick={() => onClick(fund.id)}
      className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <td className="p-6 align-middle text-center">
        <button 
          onClick={handleFavoriteClick}
          className="p-1 rounded-full text-gray-300 dark:text-gray-700 hover:text-amber-500 transition-colors"
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'text-amber-500' : ''}`} fill={isFavorite ? 'currentColor' : 'none'}/>
        </button>
      </td>
      <td className="p-6 align-middle">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
            {Icon && <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
          </div>
          <div>
            <div className="text-gray-950 dark:text-white font-semibold text-[13px]">{fund.title}</div>
            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-600 mt-0.5">{fund.providedBy}</div>
          </div>
        </div>
      </td>
      <td className="p-6 align-middle hidden md:table-cell">
        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
            {fund.sectors.join(' / ')}
        </div>
      </td>
      <td className="p-6 align-middle hidden lg:table-cell">
        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
            {fund.fundingType[0]}
        </div>
      </td>
      <td className="p-6 align-middle font-bold text-[13px] text-gray-900 dark:text-gray-100 whitespace-nowrap">
        {fund.fundingSupport}
      </td>
      <td className="p-6 align-middle whitespace-nowrap">
        <span className={`text-[11px] font-bold ${statusStyles[fund.status]}`}>
            {fund.status}
        </span>
      </td>
    </tr>
  );
};
