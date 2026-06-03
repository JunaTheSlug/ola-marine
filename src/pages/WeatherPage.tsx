import { useEffect, useState } from 'react';
import { Wind, CloudRain, Calendar, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const WeatherPage = () => {
  const [forecast, setForecast] = useState<any>(null);
  const [hourly, setHourly] = useState<any[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // NWS Forecast (Indianola/Suquamish area)
        const res = await fetch('https://api.weather.gov/gridpoints/SEW/128,68/forecast');
        const json = await res.json();
        setForecast(json.properties.periods);

        const hourlyRes = await fetch('https://api.weather.gov/gridpoints/SEW/128,68/forecast/hourly');
        const hourlyJson = await hourlyRes.json();
        setHourly(hourlyJson.properties.periods.slice(0, 24).map((p: any) => ({
          time: new Date(p.startTime).getHours() + ':00',
          temp: p.temperature,
          precip: p.probabilityOfPrecipitation?.value ?? 0
        })));
      } catch (e) {
        console.error(e);
      }
    };
    fetchWeather();
  }, []);

  if (!forecast) return (
    <div className="flex-1 h-screen bg-maritime-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
        <span className="text-cyan font-mono text-sm tracking-widest uppercase">Fetching NWS Data...</span>
      </div>
    </div>
  );

  const current = forecast[0];

  return (
    <div className="flex-1 h-screen bg-maritime-950 overflow-y-auto p-12 pl-32 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header / Today */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-slate-800/60 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-cyan" size={20} />
              <h1 className="text-4xl font-bold text-white tracking-tight">Weather Forecast</h1>
            </div>
            <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">{current.detailedForecast}</p>
          </div>
          <div className="flex items-center gap-8 bg-maritime-900/50 p-8 rounded-3xl border border-slate-800/40 backdrop-blur-xl">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Current Temp</span>
              <div className="text-6xl font-mono font-bold text-cyan tracking-tighter">{current.temperature}°{current.temperatureUnit}</div>
            </div>
            <div className="w-px h-16 bg-slate-800" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Wind Speed</span>
              <div className="text-3xl font-mono text-white tracking-tighter">{current.windSpeed}</div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{current.windDirection}</span>
            </div>
          </div>
        </div>

        {/* Hourly Trend Chart */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="text-cyan" size={18} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">24-Hour Temperature Trend</h2>
          </div>
          <div className="h-[300px] w-full bg-maritime-900/40 rounded-3xl border border-slate-800/40 p-8 backdrop-blur-md">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c1929', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f2ff', fontFamily: 'JetBrains Mono' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#00f2ff" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Cards */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-cyan" size={18} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">7-Day Outlook</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {forecast.filter((p: any) => p.isDaytime).slice(1, 8).map((day: any) => (
              <div key={day.number} className="bg-maritime-900/60 p-6 rounded-2xl border border-slate-800/40 hover:border-cyan/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-white">{day.name}</span>
                  <div className="text-cyan font-mono text-xl">{day.temperature}°</div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">{day.shortForecast}</p>
                <div className="mt-4 flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase">
                   <div className="flex items-center gap-1">
                      <Wind size={10} /> {day.windSpeed}
                   </div>
                   {day.probabilityOfPrecipitation?.value && (
                     <div className="flex items-center gap-1 text-blue-400">
                        <CloudRain size={10} /> {day.probabilityOfPrecipitation.value}%
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherPage;
