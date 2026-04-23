import { Activity, Atom, Book, Briefcase, Building2, Cpu, Globe, HeartPulse, Leaf, PenTool, Sprout } from "lucide-react";

// A mapping of keywords found in sectors to an icon.
// The first match in the array determines the icon.
export const SECTOR_ICON_MAP: { [key: string]: React.ElementType } = {
  'default': Activity,
  'technology': Cpu,
  'tech': Cpu,
  'innovation': Cpu,
  'energy': Leaf,
  'sustainability': Leaf,
  'environment': Leaf,
  'efficiency': Leaf,
  'arts': PenTool,
  'culture': PenTool,
  'agriculture': Sprout,
  'farm': Sprout,
  'education': Book,
  'school': Book,
  'business': Briefcase,
  'msme': Briefcase,
  'research': Atom,
  'science': Atom,
  'healthcare': HeartPulse,
  'biotechnology': HeartPulse,
  'social': Globe,
  'civic': Globe,
  'rural': Building2
};
