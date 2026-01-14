import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MapView } from '@/components/MapView';
import { AddMarkerButton } from '@/components/AddMarkerButton';
import { ColorPicker } from '@/components/ColorPicker';
import { OfflineAlert } from '@/components/OfflineAlert';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoadingScreen } from '@/components/LoadingScreen';
import { LocationButton } from '@/components/LocationButton';
import { useMarkers } from '@/hooks/useMarkers';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useToast } from '@/hooks/use-toast';
import type { ColorType } from '@/types/marker';
import { io } from "socket.io-client";

const socket = io("https://fleeting-marks.onrender.com");

const Index = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { markers, loading, addMarker, setMarkers, removeMarker } = useMarkers();
  const { position, requestLocation } = useGeolocation();
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  // 🔁 Підключення до WebSocket
  useEffect(() => {

    socket.on("marker:created", (marker) => {
      console.log("Нова мітка з сервера:", marker);
      setMarkers((prev) => {
        if (prev.find(m => m.id === marker.id)) return prev;
        return [...prev, marker];
      });
    });

    socket.on("marker:removed", (id) => {
      console.log("Мітка видалена сервером:", id);
      removeMarker(id);
    });

    return () => {
      socket.off("marker:created");
      socket.off("marker:removed");
    };

  }, [setMarkers, removeMarker]);

  const handleAddMarkerClick = () => {
    if (!isOnline) {
      toast({
        variant: 'destructive',
        title: 'Офлайн режим',
        description: 'Підключіться до інтернету, щоб додати мітку',
      });
      return;
    }
    setShowColorPicker(true);
  };

  const handleColorSelect = async (colorType: ColorType) => {
    setShowColorPicker(false);

    const result = await addMarker(position.lat, position.lng, colorType);

    if (result.success) {
      toast({
        title: 'Мітку додано!',
        description: 'Мітка зникне через 30 хвилин',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Помилка',
        description: result.error || 'Не вдалося додати мітку',
      });
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-full w-full relative">
      <MapView center={position} markers={markers} />

      <ThemeToggle />
      <OfflineAlert isOnline={isOnline} />

      <AddMarkerButton 
        onClick={handleAddMarkerClick} 
        disabled={!isOnline} 
      />

      <LocationButton onClick={requestLocation} />

      <AnimatePresence>
        {showColorPicker && (
          <ColorPicker
            onSelect={handleColorSelect}
            onCancel={() => setShowColorPicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
