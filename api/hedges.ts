import type { VercelRequest, VercelResponse } from '@vercel/node';
import createCDAClient from '../lib/contentful/create-cda-client';
import { entryCollectionToPaginatedResult } from '../lib/contentful/entry-collection-to-paginated-result';
import { entryToHedge } from '../lib/contentful/entry-to-hedge';
import type { HedgeEntrySkeleton } from '../lib/contentful/hedge-entry';
import withCors from '../lib/with-cors';

const getHedges = async (_req: VercelRequest, res: VercelResponse) => {
  const client = createCDAClient();

  const entryCollection =
    await client.withoutUnresolvableLinks.getEntries<HedgeEntrySkeleton>({
      content_type: 'hedge',
      limit: 1000,
    });

  res
    .status(200)
    .send(
      JSON.stringify(
        entryCollectionToPaginatedResult(entryCollection, entryToHedge),
      ),
    );
};

export default withCors(getHedges);
