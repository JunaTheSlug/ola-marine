import { ChevronDown, ChevronUp, Camera, Activity } from 'lucide-react';
import { useState } from 'react';
import WeatherTelemetry from './WeatherTelemetry';
import TideChart from './TideChart';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ExpandableCard = ({ title, icon: Icon, children, defaultExpanded = true }: any) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-maritime-900/90 backdrop-blur-xl border border-slate-800/60 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col transition-all duration-300">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 hover:bg-slate-800/20 transition-colors w-full"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className="text-cyan" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h3>
        </div>
        {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </button>
      
      <div className={cn(
        "px-6 pb-6 transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        {children}
      </div>
    </div>
  );
};

const RightSidebar = () => {
  return (
    <div className="fixed right-6 top-6 bottom-6 w-96 flex flex-col gap-6 pointer-events-none z-[1500] overflow-y-auto custom-scrollbar pr-1">
      
      <ExpandableCard title="Environment Telemetry" icon={Activity}>
        <div className="flex flex-col gap-6">
          <WeatherTelemetry />
          <div className="h-40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tide Forecast (MLLW)</span>
              <span className="text-[10px] font-mono text-cyan tracking-tighter">PORT_MADISON_WA</span>
            </div>
            <TideChart />
          </div>
        </div>
      </ExpandableCard>

      <ExpandableCard title="WeatherOla Webcam" icon={Camera} defaultExpanded={false}>
        <div className="bg-maritime-950 rounded-xl overflow-hidden border border-slate-800/40 relative group aspect-video">
           <img 
             src="/assets/webcam_latest.jpg" 
             className="w-full h-full object-cover"
             alt="Live Webcam"
             onError={(e) => {
               (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1000';
             }}
           />
           <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/50 bg-black/40 px-2 py-1 rounded backdrop-blur-sm uppercase">
              SRC: MOBILE.WEATHEROLA.COM
           </div>
           <div className="absolute top-4 right-4 px-2 py-0.5 bg-red-500/80 text-white rounded-md text-[8px] font-mono font-bold">LIVE</div>
        </div>
      </ExpandableCard>

      <div className="mt-auto pointer-events-auto">
        <div className="bg-maritime-900/80 backdrop-blur-md border border-slate-800/40 px-6 py-3 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-green rounded-full shadow-[0_0_8px_#00ff9d]" />
             <span className="text-[10px] font-mono text-slate-300 font-bold tracking-widest uppercase">PORT_MADISON_LIVE</span>
          </div>
          <span className="text-[10px] font-mono text-cyan font-bold tracking-widest">9447427</span>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
