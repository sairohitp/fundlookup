import React from 'react';
import { 
  Cpu, 
  PenTool, 
  Sprout, 
  Book, 
  Briefcase, 
  Activity,
  HeartPulse,
  Leaf,
  Atom,
  Building2,
  Globe
} from 'lucide-react';
import { SECTOR_ICON_MAP } from '../data/constants';

export const getIconForSectors = (sectors: string[]): React.ElementType => {
  if (!sectors || sectors.length === 0) {
    return SECTOR_ICON_MAP['default'];
  }
  const lowerSectors = sectors.map(s => s.toLowerCase());
  for (const keyword in SECTOR_ICON_MAP) {
    if (lowerSectors.some(sector => sector.includes(keyword))) {
      return SECTOR_ICON_MAP[keyword];
    }
  }
  return SECTOR_ICON_MAP['default'];
};
