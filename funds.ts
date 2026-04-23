import React from 'react';
import { Fund, FundStatus } from '../types';
import { getIconForSectors } from '../data/constants';
import { 
  ChevronLeft, 
  DollarSign, 
  ExternalLink, 
  Share2, 
  Rocket,
  Landmark,
  FileText,
  Link as LinkIcon,
  Globe,
  Users,
  Star
} from 'lucide-react';

interface FundDetailProps {
  fund: Fund;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (fundId: string) => void;
}

const DetailCard: React.FC<{icon: React.ElementType, label: string, value: React.ReactNode}> = ({icon: Icon, label, value}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold">
      <Icon className="w-3 h-3" />
      {label}
    </div>
    <div className="text-gray-900 dark:text-white font-semibold text-[13px]">{value}</div>
  </div>
);

const InfoLink: React.FC<{href: string, label: string, icon: React.ElementType}> = ({ href, label, icon: Icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 hover:opacity-80 transition-opacity">
    <div className="flex items-center gap-3">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
      <span className="text-[13px] font-bold text-gray-600 dark:text-gray-400">{label}</span>
    </div>
    <ExternalLink className="w-3 h-3 text-gray-300" />
  </a>
);

export const FundDetail: React.FC<FundDetailProps> = ({ fund, onBack, isFavorite, onToggleFavorite }) => {
  const Icon = getIconForSectors(fund.sectors);

  const statusStyles: { [key in FundStatus]: string } = {
    [FundStatus.OPEN]: 'text-emerald-500',
    [FundStatus.CLOSING_SOON]: 'text-amber-500',
    [FundStatus.CLOSED]: 'text-rose-500',
    [FundStatus.WAITLIST]: 'text-blue-500',
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
      
      {/* Scrollable content area */}
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 flex flex-col gap-12">
          
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to list
          </button>

          {/* Header Section */}
          <header className="space-y-8">
            <div className="flex flex-col gap-6">
              <div className="w-12 h-12 flex items-center justify-center opacity-40">
                {Icon && <Icon className="w-10 h-10 text-gray-600 dark:text-gray-300" />}
              </div>
              <div className="space-y-4">
                <h1 className="text-[15px] font-bold text-gray-950 dark:text-white leading-none">
                  {fund.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-gray-400">
                  <span className="text-gray-900 dark:text-gray-200">{fund.providedBy}</span>
                  <span className={statusStyles[fund.status]}>{fund.status}</span>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid - No Borders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 py-8 border-y border-gray-50 dark:border-gray-800">
              <DetailCard icon={DollarSign} label="Support" value={fund.fundingSupport} />
              <DetailCard icon={Rocket} label="Stage" value={fund.startupStage.join(', ')} />
              <DetailCard icon={Landmark} label="Agency" value={fund.implementationAgency} />
              <DetailCard icon={Users} label="Type" value={fund.fundingType.join(', ')} />
            </div>
          </header>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="lg:col-span-2 space-y-12">
              <section className="space-y-4">
                <h2 className="text-[11px] font-bold text-gray-400">Overview</h2>
                <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400 font-medium">{fund.description}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-[11px] font-bold text-gray-400">Process</h2>
                <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400 font-medium">{fund.applicationProcess}</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-[11px] font-bold text-gray-400">Focus</h2>
                <div className="flex flex-wrap gap-2 pt-2">
                  {fund.sectors.map(sector => (
                    <span key={sector} className="px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                      {sector}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Side Actions */}
            <aside className="space-y-10">
                <div className="space-y-4">
                   <a href={fund.websiteUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-4 rounded-full bg-indigo-600 text-white text-[13px] font-bold hover:bg-indigo-700 transition-colors">
                      Apply Now
                   </a>
                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => onToggleFavorite(fund.id)} className={`py-3 rounded-full text-[11px] font-bold border transition-all flex items-center justify-center gap-2 ${isFavorite ? 'bg-amber-400/10 border-amber-500/20 text-amber-600' : 'border-gray-100 dark:border-gray-800 text-gray-500'}`}>
                        <Star className="w-3.5 h-3.5" fill={isFavorite ? 'currentColor': 'none'} />
                        {isFavorite ? 'Saved' : 'Save'}
                      </button>
                      <button className="py-3 rounded-full text-[11px] font-bold border border-gray-100 dark:border-gray-800 text-gray-500 flex items-center justify-center gap-2">
                        Share <Share2 className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              
              <div className="space-y-6">
                <h3 className="text-[11px] font-bold text-gray-400">Resources</h3>
                <div className="space-y-1">
                  <InfoLink href={fund.websiteUrl} label="Portal" icon={Globe} />
                  <InfoLink href={fund.schemeDocumentUrl} label="Docs" icon={FileText} />
                  <InfoLink href={fund.referenceUrl} label="Links" icon={LinkIcon} />
                </div>
              </div>
            </aside>

          </div>

        </div>
      </div>
    </div>
  );
};
