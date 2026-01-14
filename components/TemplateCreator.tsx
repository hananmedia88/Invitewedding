
import React from 'react';
import { Heart } from 'lucide-react';

interface Props {
  config: {
    name: string;
    primaryColor: string;
    accentColor: string;
    bgColor: string;
    fontFamily: string;
    borderRadius: string;
  };
}

/**
 * Pure Preview Component for reuse in Studio
 */
export const StudioPreview: React.FC<Props> = ({ config }) => {
  return (
    <div 
      className="w-full h-full relative overflow-hidden transition-all duration-700"
      style={{ borderRadius: config.borderRadius, backgroundColor: config.bgColor }}
    >
      <div className="absolute inset-0 p-10 flex flex-col items-center justify-center text-center">
        <div className="space-y-8 animate-in fade-in zoom-in duration-700">
          <Heart className="w-12 h-12 mx-auto" style={{ color: config.accentColor }} />
          <div className={`space-y-4 ${config.fontFamily}`} style={{ color: config.primaryColor }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">The Wedding Of</div>
            <div className="text-5xl leading-tight">Mempelai<br/>&<br/>Mempelai</div>
            <div className="pt-4 text-xs font-bold tracking-[0.2em] opacity-80" style={{ color: config.accentColor }}>SABTU, 20 SEPTEMBER 2025</div>
          </div>
          <div className="h-px w-12 mx-auto opacity-20" style={{ backgroundColor: config.primaryColor }}></div>
          <button className="px-8 py-3 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-xl" style={{ backgroundColor: config.primaryColor }}>
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
};

// Legacy Export to prevent breakages
const TemplateCreator: React.FC<{onBack: () => void}> = ({ onBack }) => {
  return <div className="p-20 text-center">Studio is now integrated into the Admin Dashboard.</div>;
};

export default TemplateCreator;
