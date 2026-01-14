import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Marker, ColorType } from '@/types/marker';

const getClientId = (): string => {
  let clientId = localStorage.getItem('marker_client_id');
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem('marker_client_id', clientId);
  }
  return clientId;
};

export const useMarkers = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkers = useCallback(async () => {
    try {
      const now = new Date().toISOString();
      const { data, error: fetchError } = await supabase
        .from('markers')
        .select('*')
        .gt('expires_at', now)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      const typedMarkers = (data || []).map(m => ({
        ...m,
        color_type: m.color_type as ColorType
      }));
      setMarkers(typedMarkers);
      setError(null);
    } catch (err) {
      console.error('Error fetching markers:', err);
      setError('Помилка завантаження міток');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMarker = useCallback(async (
    latitude: number,
    longitude: number,
    colorType: ColorType
  ): Promise<{ success: boolean; error?: string }> => {
    const clientId = getClientId();
    
    try {
      // Check rate limit
      const { data: canCreate, error: rateError } = await supabase
        .rpc('check_rate_limit', { p_client_id: clientId });
      
      if (rateError) throw rateError;
      
      if (!canCreate) {
        return { 
          success: false, 
          error: 'Зачекайте 2 хвилини перед створенням нової мітки' 
        };
      }

      const { error: insertError } = await supabase
        .from('markers')
        .insert({
          latitude,
          longitude,
          color_type: colorType,
          client_id: clientId,
        });

      if (insertError) throw insertError;
      
      return { success: true };
    } catch (err) {
      console.error('Error adding marker:', err);
      return { 
        success: false, 
        error: 'Помилка створення мітки' 
      };
    }
  }, []);

  useEffect(() => {
    fetchMarkers();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('markers-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'markers',
        },
        (payload) => {
          const raw = payload.new as Record<string, unknown>;
          const newMarker: Marker = {
            id: raw.id as string,
            latitude: raw.latitude as number,
            longitude: raw.longitude as number,
            color_type: raw.color_type as ColorType,
            created_at: raw.created_at as string,
            expires_at: raw.expires_at as string,
            client_id: raw.client_id as string,
          };
          setMarkers((prev) => {
            if (prev.some(m => m.id === newMarker.id)) return prev;
            return [newMarker, ...prev];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'markers',
        },
        (payload) => {
          const deletedId = payload.old.id;
          setMarkers((prev) => prev.filter((m) => m.id !== deletedId));
        }
      )
      .subscribe();

    // Cleanup expired markers locally every 10 seconds
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      setMarkers((prev) => 
        prev.filter((m) => new Date(m.expires_at) > now)
      );
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(cleanupInterval);
    };
  }, [fetchMarkers]);

  return { markers, loading, error, addMarker, refetch: fetchMarkers };
};