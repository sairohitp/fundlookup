import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-xl
        bg-white/60 dark:bg-black/40 
        backdrop-blur-3xl backdrop-saturate-150 
        border border-[#505050]/30 dark:border-[#505050]/60
        shadow-2xl shadow-black/5 dark:shadow-black/20
        ring-1 ring-[#505050]/10 dark:ring-[#505050]/20 ring-inset
        transition-all duration-500 ease-out
        ${hoverEffect ? 'hover:-translate-y-0.5 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50 hover:border-[#505050]/50 dark:hover:border-[#505050]/80' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};