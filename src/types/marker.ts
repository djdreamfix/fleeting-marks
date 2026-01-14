export type ColorType = 'blue' | 'green' | 'split';

export interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  color_type: ColorType;
  created_at: string;
  expires_at: string;
  client_id: string;
}