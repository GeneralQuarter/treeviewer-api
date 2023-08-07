
import type { Hedge } from '../hedge';
import type { HedgeEntry } from './hedge-entry';

export function entryToHedge(entry: HedgeEntry): Hedge {
  return {
    id: entry.sys.id,
    name: entry.fields.name,
    coords: entry.fields.coords,
  }
}
