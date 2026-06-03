import { useEffect, useState } from 'react';
import { Thermometer, Wind, Gauge } from 'lucide-react';

const WeatherTelemetry = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Indianola Grid: SEW/128,68
        const res = await fetch('https://api.weather.gov/stations/KOLM/observations/latest');
        const json = await res.json();
        setWeather(json.properties);
      } catch (e) {
        // Fallback or mock
        setWeather({
          temperature: { value: 14.5 },
          windSpeed: { value: 12 },
          barometricPressure: { value: 101200 }
        });
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!weather) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-maritime-950/50 p-4 rounded-xl border border-slate-800/40">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer size={14} className="text-orange-400" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Temp</span>
        </div>
        <div className="text-xl font-mono text-white">{(weather.temperature?.value ?? 14).toFixed(1)}°C</div>
      </div>

      <div className="bg-maritime-950/50 p-4 rounded-xl border border-slate-800/40">
        <div className="flex items-center gap-2 mb-2">
          <Wind size={14} className="text-cyan" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Wind</span>
        </div>
        <div className="text-xl font-mono text-cyan">{(weather.windSpeed?.value ?? 8).toFixed(1)} <span className="text-xs">kts</span></div>
      </div>

      <div className="bg-maritime-950/50 p-4 rounded-xl border border-slate-800/40">
        <div className="flex items-center gap-2 mb-2">
          <Gauge size={14} className="text-green" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Baro</span>
        </div>
        <div className="text-xl font-mono text-green">{((weather.barometricPressure?.value ?? 101325) / 100).toFixed(0)} <span className="text-xs">hPa</span></div>
      </div>
    </div>
  );
};

export default WeatherTelemetry;
