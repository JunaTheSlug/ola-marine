import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AISMap from './components/AISMap';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import WeatherPage from './pages/WeatherPage';
import TidesPage from './pages/TidesPage';
import { X, Info } from 'lucide-react';

// Wrap AISMap to include the selection overlay and right sidebar
const MapView = ({ selectedVessel, setSelectedVessel }: any) => (
  <>
    <AISMap onSelectVessel={setSelectedVessel} />
    <RightSidebar />
    
    {selectedVessel && (
      <div className="fixed right-6 top-[550px] w-96 bg-maritime-900/95 backdrop-blur-xl border border-cyan/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,242,255,0.15)] z-[2000] animate-in slide-in-from-right">
        <div className="flex items-center justify-between mb-6">
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
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MMSI_IDENTITY</p>
            <p className="text-sm font-mono text-white tracking-tighter">MID_{selectedVessel.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Navigational Status</p>
            <p className="text-sm font-mono text-cyan tracking-tighter uppercase">UNDER_WAY</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Speed Over Ground</p>
            <p className="text-sm font-mono text-white tracking-tighter">{selectedVessel.speed} kts</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">True Heading</p>
            <p className="text-sm font-mono text-white tracking-tighter">{selectedVessel.heading}°</p>
          </div>
        </div>

        <button className="w-full mt-6 py-2 bg-cyan/10 border border-cyan/20 rounded-xl text-[10px] font-bold text-cyan uppercase tracking-widest hover:bg-cyan/20 transition-all flex items-center justify-center gap-2">
          <Info size={14} /> Full Vessel Registry
        </button>
      </div>
    )}
  </>
);

export default function App() {
  const [selectedVessel, setSelectedVessel] = useState<any>(null);

  return (
    <Router>
      <div className="relative w-full h-screen bg-maritime-950 overflow-hidden font-sans text-slate-200">
        <Sidebar />
        
        <main className="w-full h-full flex">
          <Routes>
            <Route path="/" element={<MapView selectedVessel={selectedVessel} setSelectedVessel={setSelectedVessel} />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/tides" element={<TidesPage />} />
            {/* Fallbacks */}
            <Route path="*" element={<MapView selectedVessel={selectedVessel} setSelectedVessel={setSelectedVessel} />} />
          </Routes>
        </main>

        {/* Global Map Layer Controls (only on map) */}
        <Routes>
          <Route path="/" element={
            <div className="fixed left-[100px] bottom-6 bg-maritime-900/80 backdrop-blur-md border border-slate-800/40 p-1.5 rounded-xl flex gap-1 z-[1500]">
              {['Standard', 'Satellite', 'Nautical'].map(layer => (
                <button key={layer} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${layer === 'Standard' ? 'bg-cyan text-maritime-950 shadow-[0_0_10px_rgba(0,242,255,0.4)]' : 'text-slate-500 hover:text-white'}`}>
                  {layer}
                </button>
              ))}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}
