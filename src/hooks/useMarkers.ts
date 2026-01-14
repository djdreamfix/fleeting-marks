import { useState, useEffect, useCallback } from 'react';
import type { Marker, ColorType } from '@/types/marker';
import { io } from "socket.io-client";

const socket = io("https://fleeting-marks.onrender.com");

export const useMarkers = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📥 Завантаження активних міток з сервера
  const fetchMarkers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("https://fleeting-marks.onrender.com/api/markers");
      if (!res.ok) throw new Error("Fetch failed");

      const data: Marker[] = await res.json();
      setMarkers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching markers:", err);
      setError("Помилка завантаження міток");
    } finally {
      setLoading(false);
    }
  }, []);

  // ➕ Створення мітки через сервер
  const addMarker = useCallback(async (
    latitude: number,
    longitude: number,
    colorType: ColorType
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("https://fleeting-marks.onrender.com/api/markers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude, colorType }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      return { success: true };
    } catch (err) {
      console.error("Error adding marker:", err);
      return {
        success: false,
        error: "Помилка створення мітки"
      };
    }
  }, []);

  // 🔁 WebSocket синхронізація
  useEffect(() => {
    fetchMarkers();

    socket.on("marker:created", (marker: Marker) => {
      setMarkers((prev) => {
        if (prev.some(m => m.id === marker.id)) return prev;
        return [marker, ...prev];
      });
    });

    socket.on("marker:removed", (id: string) => {
      setMarkers((prev) => prev.filter((m) => m.id !== id));
    });

    return () => {
      socket.off("marker:created");
      socket.off("marker:removed");
    };
  }, [fetchMarkers]);

  return { markers, loading, error, addMarker, setMarkers };
};
