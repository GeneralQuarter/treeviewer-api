import { Entry, EntryFields } from 'contentful';
import { PlantEntry } from './plant-entry';

export interface HedgeFields {
  name: EntryFields.Symbol,
  plants: PlantEntry[];
}

export interface HedgeEntry extends Entry<HedgeFields> {}