import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';

type MapSectorFields = {
  name: EntryFieldTypes.Symbol;
  geojson: EntryFieldTypes.Object<any>;
  wateredAt: EntryFieldTypes.Date;
};

export type MapSectorEntrySkeleton = EntrySkeletonType<
  MapSectorFields,
  'mapSector'
>;
export type MapSectorEntry = Entry<
  MapSectorEntrySkeleton,
  'WITHOUT_UNRESOLVABLE_LINKS',
  'fr'
>;
