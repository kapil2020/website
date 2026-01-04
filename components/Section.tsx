
import React, { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
  altBg?: boolean;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className = '', altBg = false }) => {
  return (
    <section 
      id={id} 
      className={`relative py-20 px-6 md:px-12 lg:px-24 overflow-hidden transition-colors duration-300 ${altBg ? 'bg-surface/40' : 'bg-transparent'} ${className}`}
    >
      <div className="max-w-7xl mx-auto z-10 relative">
        {title && (
          <div className="mb-16">
             <div className="flex items-center gap-4 mb-2">
                <div className="h-[2px] w-12 bg-accent rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Section</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-primary">
               {title}
             </h2>
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
