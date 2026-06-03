import { ChevronDown, Waves } from 'lucide-react';
import TideChart from './TideChart';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ExpandableCard = ({ title, icon: Icon, id, children, activeCard, onToggle }: any) => {
  const isExpanded = activeCard === id;

  return (
    <div className={cn(
      "bg-maritime-900/80 backdrop-blur-lg border border-slate-800/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-auto",
      isExpanded ? "ring-1 ring-cyan/30 shadow-cyan/10" : ""
    )}>
      <button 
        onClick={() => onToggle(id)}
        className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors w-full group"
      >
        <div className="flex items-center gap-3">
          <Icon size={14} className={cn("transition-transform duration-300", isExpanded ? "text-cyan scale-110" : "text-slate-500 group-hover:text-slate-300")} />
          <h3 className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors", isExpanded ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>{title}</h3>
        </div>
        <div className={cn("transition-transform duration-500", isExpanded ? "rotate-180" : "rotate-0")}>
           <ChevronDown size={14} className={isExpanded ? "text-cyan" : "text-slate-500"} />
        </div>
      </button>
      
      <div className={cn(
        "px-5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
        isExpanded ? "max-h-[500px] pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
};

const RightSidebar = ({ activeCard, onToggleCard }: any) => {
  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 flex flex-col gap-4 pointer-events-none z-[1500]">
      
      <ExpandableCard title="Tidal Forecast" icon={Waves} id="tides" activeCard={activeCard} onToggle={onToggleCard}>
        <div className="h-44 pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">MLLW Datum</span>
            <span className="text-[9px] font-mono text-cyan tracking-tighter uppercase">PT_JEFFERSON_WA</span>
          </div>
          <TideChart />
        </div>
      </ExpandableCard>

      <div className="pointer-events-auto">
        <div className="bg-maritime-900/60 backdrop-blur-md border border-slate-800/30 px-5 py-2 rounded-xl shadow-xl flex items-center justify-between group hover:border-cyan/20 transition-all">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green rounded-full shadow-[0_0_8px_#00ff9d] animate-pulse" />
             <span className="text-[9px] font-mono text-slate-400 font-bold tracking-widest uppercase">STATION_LIVE</span>
          </div>
          <span className="text-[9px] font-mono text-cyan/70 font-bold tracking-widest">9445958</span>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
