import { useEffect, useState } from 'react';
import { Marker as LeafletMarker } from 'react-leaflet';
import L from 'leaflet';
import type { Marker } from '@/types/marker';

interface MarkerLayerProps {
  markers: Marker[];
}

const getMinutesRemaining = (expiresAt: string): number => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 60000));
};

const getMarkerHtml = (colorType: string, minutes: number, isExpiring: boolean): string => {
  let bgClass = '';
  let bgStyle = '';
  
  if (colorType === 'blue') {
    bgStyle = 'background: hsl(217, 91%, 60%);';
  } else if (colorType === 'green') {
    bgStyle = 'background: hsl(160, 84%, 39%);';
  } else {
    bgStyle = 'background: linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(217, 91%, 60%) 50%, hsl(160, 84%, 39%) 50%, hsl(160, 84%, 39%) 100%);';
  }

  const opacityClass = isExpiring ? 'opacity: 0.6;' : '';
  const pulseAnimation = !isExpiring ? 'animation: pulse 2s ease-in-out infinite;' : '';

  return `
    <div style="
      width: 48px;
      height: 48px;
      border-radius: 50%;
      ${bgStyle}
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 3px solid white;
      ${opacityClass}
      ${pulseAnimation}
    ">
      <span style="
        color: white;
        font-weight: 700;
        font-size: 16px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      ">${minutes}</span>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    </style>
  `;
};

export const MarkerLayer = ({ markers }: MarkerLayerProps) => {
  const [, setTick] = useState(0);

  // Update every 30 seconds to refresh timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {markers.map((marker) => {
        const minutes = getMinutesRemaining(marker.expires_at);
        const isExpiring = minutes <= 5;

        const icon = L.divIcon({
          className: 'custom-marker',
          html: getMarkerHtml(marker.color_type, minutes, isExpiring),
          iconSize: [48, 48],
          iconAnchor: [24, 24],
        });

        return (
          <LeafletMarker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={icon}
          />
        );
      })}
    </>
  );
};