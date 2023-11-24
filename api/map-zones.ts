import { VercelRequest, VercelResponse } from '@vercel/node';
import createCDAClient from '../lib/contentful/create-cda-client';
import { entryCollectionToPaginatedResult } from '../lib/contentful/entry-collection-to-paginated-result';
import withCors from '../lib/with-cors';
import { MapZoneEntrySkeleton } from '../lib/contentful/map-zone-entry';
import { entryToMapZone } from '../lib/contentful/entry-to-map-zone';

const getMapZones = async (req: VercelRequest, res: VercelResponse) => {
  const client = createCDAClient();

  const entryCollection = await client.withoutUnresolvableLinks.getEntries<MapZoneEntrySkeleton>({
    content_type: 'mapZone',
    limit: 1000,
    'fields.coords[exists]': true,
  });

  res.status(200).send(JSON.stringify(entryCollectionToPaginatedResult(entryCollection, entryToMapZone)));
};

export default withCors(getMapZones);
