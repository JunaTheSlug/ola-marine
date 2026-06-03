import { useEffect, useState } from 'react';
import { Waves, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const TidesPage = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [extremes, setExtremes] = useState<any[]>([]);

  useEffect(() => {
    const fetchTides = async () => {
      try {
        // Port Madison Station 9447427
        const predUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9447427&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;
        const res = await fetch(predUrl);
        const json = await res.json();
        setPredictions(json.predictions.map((p: any) => ({
          time: p.t.split(' ')[1],
          v: parseFloat(p.v)
        })));

        const highLowUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9447427&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&interval=hilo&format=json`;
        const hlRes = await fetch(highLowUrl);
        const hlJson = await hlRes.json();
        setExtremes(hlJson.predictions);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTides();
  }, []);

  if (predictions.length === 0) return (
    <div className="flex-1 h-screen bg-maritime-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <span className="text-cyan font-mono text-sm tracking-widest uppercase">Fetching NOAA Tides...</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 h-screen bg-maritime-950 overflow-y-auto p-12 pl-32 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-slate-800/60 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Waves className="text-cyan" size={24} />
              <h1 className="text-4xl font-bold text-white tracking-tight">Port Madison Tides</h1>
            </div>
            <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed uppercase font-mono">Station ID: 9447427 | Datum: MLLW</p>
          </div>
        </div>

        {/* High/Low Extremes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {extremes.map((ex, i) => (
             <div key={i} className="bg-maritime-900/60 p-6 rounded-2xl border border-slate-800/40 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{ex.type === 'H' ? 'High Tide' : 'Low Tide'}</span>
                   {ex.type === 'H' ? <ArrowUp className="text-green" size={14} /> : <ArrowDown className="text-cyan" size={14} />}
                </div>
                <div className="text-3xl font-mono font-bold text-white mb-1">{ex.v} ft</div>
                <div className="text-xs font-mono text-slate-400">{ex.t.split(' ')[1]}</div>
                <div className={cn("absolute bottom-0 left-0 right-0 h-1", ex.type === 'H' ? 'bg-green/30' : 'bg-cyan/30')} />
             </div>
           ))}
        </div>

        {/* Main Tide Graph */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="text-cyan" size={18} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Tidal Prediction Curve (24h)</h2>
          </div>
          <div className="h-[450px] w-full bg-maritime-900/40 rounded-3xl border border-slate-800/40 p-8 backdrop-blur-md">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictions}>
                <defs>
                  <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} minTickGap={60} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c1929', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f2ff', fontFamily: 'JetBrains Mono' }}
                />
                <Area type="monotone" dataKey="v" name="Level (ft)" stroke="#00f2ff" fillOpacity={1} fill="url(#colorTide)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default TidesPage;
