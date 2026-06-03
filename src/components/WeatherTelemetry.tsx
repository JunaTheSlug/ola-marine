import { useEffect, useState } from 'react';
import { Thermometer, Wind, Gauge } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WeatherTelemetry = () => {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [showTomorrow, setShowTomorrow] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Current Observations
        const obsRes = await fetch('https://api.weather.gov/stations/KOLM/observations/latest');
        const obsJson = await obsRes.json();
        setWeather(obsJson.properties);

        // Forecast for Indianola (47.73, -122.52)
        const forecastRes = await fetch('https://api.weather.gov/gridpoints/SEW/128,68/forecast');
        const forecastJson = await forecastRes.json();
        // Period 2 or 3 is usually tomorrow depending on time of day
        // We look for the first period that doesn't include "Today" or "Tonight" in the name, 
        // or just pick the next day-time period.
        const tomorrow = forecastJson.properties?.periods?.find((p: any) => 
          p.name.toLowerCase().includes('tomorrow') || 
          p.isDaytime === true && !p.name.toLowerCase().includes('today')
        ) || forecastJson.properties?.periods?.[2];
        setForecast(tomorrow);
      } catch (e) {
        console.error('Weather fetch error:', e);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!weather) return <div className="h-24 flex items-center justify-center text-slate-500 font-mono text-[10px] animate-pulse">LOADING_TELEMETRY...</div>;

  const data = showTomorrow && forecast ? {
    temp: `${forecast.temperature}°${forecast.temperatureUnit}`,
    wind: `${forecast.windSpeed} ${forecast.windDirection}`,
    desc: forecast.shortForecast,
    isForecast: true
  } : {
    temp: `${(weather.temperature?.value ?? 14).toFixed(1)}°C`,
    wind: `${(weather.windSpeed?.value ?? 8).toFixed(1)} kts`,
    baro: `${((weather.barometricPressure?.value ?? 101325) / 100).toFixed(0)} hPa`,
    isForecast: false
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-maritime-950/30 p-1 rounded-lg border border-slate-800/40 w-fit">
        <button 
          onClick={() => setShowTomorrow(false)}
          className={cn("px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all", !showTomorrow ? "bg-cyan text-maritime-950" : "text-slate-500 hover:text-slate-300")}
        >
          Today
        </button>
        <button 
          onClick={() => setShowTomorrow(true)}
          className={cn("px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all", showTomorrow ? "bg-cyan text-maritime-950" : "text-slate-500 hover:text-slate-300")}
        >
          Tomorrow
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-maritime-950/50 p-3 rounded-xl border border-slate-800/40 group hover:border-orange-400/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer size={12} className="text-orange-400" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Temp</span>
          </div>
          <div className="text-lg font-mono text-white leading-none">{data.temp}</div>
        </div>

        <div className="bg-maritime-950/50 p-3 rounded-xl border border-slate-800/40 group hover:border-cyan/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Wind size={12} className="text-cyan" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Wind</span>
          </div>
          <div className="text-lg font-mono text-cyan leading-none">{data.wind}</div>
        </div>

        <div className="bg-maritime-950/50 p-3 rounded-xl border border-slate-800/40 group hover:border-green/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Gauge size={12} className="text-green" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{data.isForecast ? 'Cond' : 'Baro'}</span>
          </div>
          <div className="text-[10px] font-mono text-green leading-tight">
            {data.isForecast ? (forecast.shortForecast.length > 15 ? forecast.shortForecast.substring(0, 12) + '...' : forecast.shortForecast) : (data as any).baro}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherTelemetry;
