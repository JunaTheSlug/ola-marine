import { useState } from 'react';
import AISMap from './components/AISMap';
import RightSidebar from './components/RightSidebar';
import { X, Info } from 'lucide-react';

export default function App() {
  const [selectedVessel, setSelectedVessel] = useState<any>(null);
  const [activeCard, setActiveCard] = useState<string | null>('tides');

  const toggleCard = (card: string) => {
    setActiveCard(prev => prev === card ? null : card);
  };

  return (
    <div className="relative w-full h-screen bg-maritime-950 overflow-hidden font-sans text-slate-200">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <AISMap onSelectVessel={setSelectedVessel} />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Responsive Right Sidebar */}
        <RightSidebar activeCard={activeCard} onToggleCard={toggleCard} />

        {/* Vessel Detail Overlay */}
        {selectedVessel && (
          <div className="fixed left-4 right-4 bottom-24 md:left-auto md:right-6 md:top-[500px] md:bottom-auto md:w-96 bg-maritime-900/95 backdrop-blur-xl border border-cyan/30 rounded-2xl p-6 shadow-2xl z-[2000] pointer-events-auto animate-in slide-in-from-bottom md:slide-in-from-right">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${selectedVessel.type === 'pleasure' ? 'bg-cyan' : selectedVessel.type === 'cargo' ? 'bg-green' : 'bg-purple'}`} />
                <h3 className="text-white font-bold tracking-tight">{selectedVessel.name}</h3>
              </div>
              <button onClick={() => setSelectedVessel(null)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MMSI</p>
                <p className="text-xs font-mono text-white">MID_{selectedVessel.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status</p>
                <p className="text-xs font-mono text-cyan uppercase tracking-tighter">UNDER_WAY</p>
              </div>
            </div>

            <button className="w-full mt-4 py-2 bg-cyan/10 border border-cyan/20 rounded-xl text-[10px] font-bold text-cyan uppercase tracking-widest hover:bg-cyan/20 transition-all flex items-center justify-center gap-2">
              <Info size={14} /> Registry
            </button>
          </div>
        )}

        {/* Global Map Layer Controls */}
        <div className="fixed left-4 right-4 bottom-6 md:left-6 md:right-auto bg-maritime-900/80 backdrop-blur-md border border-slate-800/40 p-1 rounded-xl flex gap-1 z-[1500] pointer-events-auto">
          {['Standard', 'Satellite', 'Nautical'].map(layer => (
            <button key={layer} className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${layer === 'Standard' ? 'bg-cyan text-maritime-950' : 'text-slate-500 hover:text-white'}`}>
              {layer}
            </button>
          ))}
        </div>

        {/* Build Identifier */}
        <div className="fixed top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded text-[8px] font-mono text-white/30 z-[3000]">
           OLA_MARINE_BUILD_20260603_2345
        </div>
      </div>
    </div>
  );
}
