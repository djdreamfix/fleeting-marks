import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MarkerLayer } from './MarkerLayer';
import type { Marker } from '@/types/marker';

interface MapViewProps {
  center: { lat: number; lng: number };
  markers: Marker[];
  onMapClick?: (lat: number, lng: number) => void;
}

const MapController = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  const initialCenterSet = useRef(false);

  useEffect(() => {
    if (!initialCenterSet.current && center.lat && center.lng) {
      map.setView([center.lat, center.lng], 14);
      initialCenterSet.current = true;
    }
  }, [center, map]);

  return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      if (!onMapClick) return;
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });

  return null;
};

export const MapView = ({ center, markers, onMapClick }: MapViewProps) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} />
      <MapClickHandler onMapClick={onMapClick} />
      <MarkerLayer markers={markers} />
    </MapContainer>
  );
};
