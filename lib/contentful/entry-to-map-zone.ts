import type { MapZone } from '../map-zone';
import type { MapZoneEntry } from './map-zone-entry';

export function entryToMapZone(entry: MapZoneEntry): MapZone {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    orientation: entry.fields.orientation,
    coords: entry.fields.coords,
  };
}
