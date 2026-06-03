import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

const TideChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Port Madison Station ID: 9447427
    const fetchTides = async () => {
      try {
        const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9447427&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;
        const res = await fetch(url);
        const json = await res.json();
        const formatted = json.predictions.map((p: any) => ({
          time: p.t.split(' ')[1],
          v: parseFloat(p.v)
        })).filter((_: any, i: number) => i % 4 === 0); // Decimate for UI
        setData(formatted);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTides();
  }, []);

  return (
    <div className="h-full w-full">
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
            tick={{ fill: '#64748b', fontSize: 10 }}
            minTickGap={30}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0c1929', borderColor: '#1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#00f2ff', fontFamily: 'JetBrains Mono' }}
          />
          <Area 
            type="monotone" 
            dataKey="v" 
            stroke="#00f2ff" 
            fillOpacity={1} 
            fill="url(#colorV)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TideChart;
