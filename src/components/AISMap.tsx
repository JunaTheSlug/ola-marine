import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Bounding box for Indianola / Port Madison area
const CENTER: [number, number] = [47.7300, -122.5217];

interface Vessel {
  id: string;
  name: string;
  type: 'pleasure' | 'cargo' | 'ferry';
  lat: number;
  lng: number;
  speed: number;
  heading: number;
}

const createVesselIcon = (type: string, heading: number) => {
  const color = type === 'pleasure' ? '#00f2ff' : type === 'cargo' ? '#00ff9d' : '#bc00ff';
  return L.divIcon({
    className: 'custom-vessel-icon',
    html: `<div style="transform: rotate(${heading}deg); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 20px solid ${color}; filter: drop-shadow(0 0 5px ${color}88);"></div>`,
    iconSize: [16, 20],
    iconAnchor: [8, 10],
  });
};

const VesselLayer = ({ onSelectVessel }: { onSelectVessel: (v: Vessel) => void }) => {
  const [vessels, setVessels] = useState<Vessel[]>([
    { id: 'F1', name: 'Kingston Ferry', type: 'ferry', lat: 47.79, lng: -122.48, speed: 18, heading: 110 },
    { id: 'P1', name: 'Privateer', type: 'pleasure', lat: 47.72, lng: -122.51, speed: 8, heading: 45 },
    { id: 'C1', name: 'Global Transporter', type: 'cargo', lat: 47.75, lng: -122.55, speed: 12, heading: 180 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVessels(prev => prev.map(v => {
        const rad = (v.heading * Math.PI) / 180;
        const speedFactor = v.speed * 0.00001;
        return {
          ...v,
          lat: v.lat + Math.cos(rad) * speedFactor,
          lng: v.lng + Math.sin(rad) * speedFactor,
        };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {vessels.map(v => (
        <Marker 
          key={v.id} 
          position={[v.lat, v.lng]} 
          icon={createVesselIcon(v.type, v.heading)}
          eventHandlers={{ click: () => onSelectVessel(v) }}
        />
      ))}
    </>
  );
};

export default function AISMap({ onSelectVessel }: { onSelectVessel: (v: Vessel) => void }) {
  return (
    <MapContainer center={CENTER} zoom={13} zoomControl={false} attributionControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <VesselLayer onSelectVessel={onSelectVessel} />
    </MapContainer>
  );
}
