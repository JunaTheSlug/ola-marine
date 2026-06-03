import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TideChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [showTomorrow, setShowTomorrow] = useState(false);

  useEffect(() => {
    // Point Jefferson Station ID: 9445958 (Reliable harmonic predictions for Indianola area)
    const fetchTides = async () => {
      try {
        const dateStr = showTomorrow ? 'tomorrow' : 'today';
        const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=${dateStr}&station=9445958&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        
        if (json.predictions) {
          const formatted = json.predictions.map((p: any) => ({
            time: p.t.split(' ')[1],
            v: parseFloat(p.v)
          })).filter((_: any, i: number) => i % 4 === 0); // Decimate for UI
          setData(formatted);
        }
      } catch (e) {
        console.error('Tide fetch error:', e);
      }
    };
    fetchTides();
  }, [showTomorrow]);

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex items-center gap-2 bg-maritime-950/30 p-1 rounded-lg border border-slate-800/40 w-fit pointer-events-auto">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowTomorrow(false); }}
          className={cn("px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all", !showTomorrow ? "bg-cyan text-maritime-950" : "text-slate-500 hover:text-slate-300")}
        >
          Today
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setShowTomorrow(true); }}
          className={cn("px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all", showTomorrow ? "bg-cyan text-maritime-950" : "text-slate-500 hover:text-slate-300")}
        >
          Tomorrow
        </button>
      </div>
      
      <div className="flex-1 w-full min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 9 }}
              minTickGap={30}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0c1929', borderColor: '#1e293b', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#00f2ff', fontFamily: 'JetBrains Mono' }}
            />
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke="#00f2ff" 
              fillOpacity={1} 
              fill="url(#colorV)" 
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TideChart;
