import type { Feature, Polygon } from 'geojson';
import type { MapSector } from '../map-sector';
import type { MapSectorEntry } from './map-sector-entry';

export function entryToMapSector(entry: MapSectorEntry): MapSector {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    geojson: entry.fields.geojson as Feature<Polygon>,
    wateredAt: entry.fields.wateredAt,
  };
}
