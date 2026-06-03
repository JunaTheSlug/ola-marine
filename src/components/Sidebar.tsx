import { Anchor, Wind, Waves, Camera, Settings, Activity, Map as MapIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Wind, label: 'Weather', path: '/' },
    { icon: Waves, label: 'Tides', path: '/' },
    { icon: Camera, label: 'Webcam', path: '/' },
    { icon: Settings, label: 'Settings', path: '/' },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "fixed left-4 top-4 bottom-4 bg-maritime-900/90 backdrop-blur-xl border border-slate-800/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[2000] flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        isExpanded ? "w-64 p-6" : "w-20 p-4 items-center"
      )}
    >
      <div className={cn("flex items-center gap-3 mb-8 px-2 w-full", !isExpanded && "justify-center px-0")}>
        <div className="min-w-[40px] h-10 bg-cyan/20 rounded-lg flex items-center justify-center border border-cyan/30">
          <Anchor className="text-cyan" size={24} />
        </div>
        {isExpanded && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-lg font-bold text-white tracking-tight whitespace-nowrap">Ola Marine</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">Indianola, WA</p>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-y-3 w-full">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-4 rounded-xl transition-all duration-200 group relative",
                isExpanded ? "p-3 px-4 w-full" : "p-3 justify-center",
                isActive 
                  ? 'bg-cyan/10 text-cyan border border-cyan/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border border-transparent'
              )}
            >
              <item.icon size={20} className={isActive ? 'text-cyan' : 'group-hover:text-white'} />
              {isExpanded && (
                <span className="text-sm font-semibold tracking-wide animate-in slide-in-from-left-2 duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {!isExpanded && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-maritime-900 border border-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[3000]">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className={cn("mt-auto pt-6 border-t border-slate-800/60 w-full", !isExpanded && "border-none")}>
        <div className={cn("bg-maritime-950/50 rounded-xl border border-slate-800/40", isExpanded ? "p-4" : "p-2 flex justify-center")}>
          {isExpanded ? (
            <>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Network Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green rounded-full animate-pulse shadow-[0_0_8px_#00ff9d]" />
                <span className="text-xs font-mono text-green tracking-tighter uppercase">UPLINK_STABLE</span>
              </div>
            </>
          ) : (
            <div className="w-2 h-2 bg-green rounded-full animate-pulse shadow-[0_0_8px_#00ff9d]" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
