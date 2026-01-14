import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number;
  longitude: number;
  error: string | null;
  loading: boolean;
}

const DEFAULT_POSITION = { lat: 50.4501, lng: 30.5234 }; // Kyiv

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: DEFAULT_POSITION.lat,
    longitude: DEFAULT_POSITION.lng,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Геолокація не підтримується браузером',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Помилка визначення локації';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Доступ до геолокації заборонено';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Інформація про місцезнаходження недоступна';
            break;
          case error.TIMEOUT:
            errorMessage = 'Час очікування геолокації вичерпано';
            break;
        }
        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    ...state,
    position: { lat: state.latitude, lng: state.longitude },
    requestLocation,
  };
};