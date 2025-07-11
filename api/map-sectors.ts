import type { VercelRequest, VercelResponse } from '@vercel/node';
import createCDAClient from '../lib/contentful/create-cda-client';
import { entryCollectionToPaginatedResult } from '../lib/contentful/entry-collection-to-paginated-result';
import { entryToMapSector } from '../lib/contentful/entry-to-map-sector';
import type { MapSectorEntrySkeleton } from '../lib/contentful/map-sector-entry';
import withCors from '../lib/with-cors';

const getMapSectors = async (_req: VercelRequest, res: VercelResponse) => {
  const client = createCDAClient();

  const entryCollection =
    await client.withoutUnresolvableLinks.getEntries<MapSectorEntrySkeleton>({
      content_type: 'mapSector',
      limit: 1000,
      'fields.geojson[exists]': true,
    });

  res
    .status(200)
    .send(
      JSON.stringify(
        entryCollectionToPaginatedResult(entryCollection, entryToMapSector),
      ),
    );
};

export default withCors(getMapSectors);
