import { ChevronDown, Waves, Camera, Activity } from 'lucide-react';
import WeatherTelemetry from './WeatherTelemetry';
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
      "bg-maritime-900/90 backdrop-blur-xl border border-slate-800/60 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
      isExpanded ? "ring-1 ring-cyan/30" : ""
    )}>
      <button 
        onClick={() => onToggle(id)}
        className="flex items-center justify-between p-5 hover:bg-slate-800/20 transition-colors w-full group"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className={cn("transition-transform duration-300", isExpanded ? "text-cyan scale-110" : "text-slate-500 group-hover:text-slate-300")} />
          <h3 className={cn("text-xs font-bold uppercase tracking-widest transition-colors", isExpanded ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>{title}</h3>
        </div>
        <div className={cn("transition-transform duration-500", isExpanded ? "rotate-180" : "rotate-0")}>
           <ChevronDown size={16} className={isExpanded ? "text-cyan" : "text-slate-500"} />
        </div>
      </button>
      
      <div className={cn(
        "px-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
        isExpanded ? "max-h-[800px] pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );
};

const RightSidebar = ({ activeCard, setActiveCard }: any) => {
  return (
    <div className="fixed right-6 top-6 bottom-6 w-96 flex flex-col gap-4 pointer-events-none z-[1500] overflow-y-auto custom-scrollbar pr-1">
      
      <ExpandableCard title="Weather Conditions" icon={Activity} id="weather" activeCard={activeCard} onToggle={setActiveCard}>
        <WeatherTelemetry />
      </ExpandableCard>

      <ExpandableCard title="Tidal Forecast" icon={Waves} id="tides" activeCard={activeCard} onToggle={setActiveCard}>
        <div className="h-48 pt-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MLLW Datum</span>
            <span className="text-[10px] font-mono text-cyan tracking-tighter uppercase">POINT_JEFFERSON_WA</span>
          </div>
          <TideChart />
        </div>
      </ExpandableCard>

      <ExpandableCard title="WeatherOla Webcam" icon={Camera} id="webcam" activeCard={activeCard} onToggle={setActiveCard}>
        <div className="bg-maritime-950 rounded-xl overflow-hidden border border-slate-800/40 relative group aspect-video">
           <img 
             src="/assets/webcam_latest.jpg" 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
             alt="Live Webcam"
             onError={(e) => {
               (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1000';
             }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
           <div className="absolute bottom-4 left-4 text-[8px] font-mono text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur-sm uppercase tracking-tighter">
              SRC: MOBILE.WEATHEROLA.COM
           </div>
           <div className="absolute top-4 right-4 px-2 py-0.5 bg-red-500/80 text-white rounded-md text-[8px] font-mono font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)]">LIVE</div>
        </div>
      </ExpandableCard>

      <div className="mt-auto pointer-events-auto">
        <div className="bg-maritime-900/80 backdrop-blur-md border border-slate-800/40 px-6 py-3 rounded-2xl shadow-xl flex items-center justify-between group hover:border-cyan/30 transition-all">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-green rounded-full shadow-[0_0_8px_#00ff9d] animate-pulse" />
             <span className="text-[10px] font-mono text-slate-300 font-bold tracking-widest uppercase">PT_JEFFERSON_LIVE</span>
          </div>
          <span className="text-[10px] font-mono text-cyan font-bold tracking-widest group-hover:drop-shadow-[0_0_5px_rgba(0,242,255,0.5)] transition-all">9445958</span>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
