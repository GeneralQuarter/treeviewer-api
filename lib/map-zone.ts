export interface MapZone {
  id: string;
  name: string;
  orientation: 'portrait' | 'landscape';
  coords: [lat: number, lon: number][];
}
