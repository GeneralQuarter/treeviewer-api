import { VercelRequest, VercelResponse } from '@vercel/node';
import createCDAClient from '../lib/contentful/create-cda-client';
import { entryCollectionToPaginatedResult } from '../lib/contentful/entry-collection-to-paginated-result';
import { entryToPlant } from '../lib/contentful/entry-to-plant';
import withCors from '../lib/with-cors';
import { PlantEntrySkeleton } from '../lib/contentful/plant-entry';
import { EntriesQueries } from 'contentful';

const chunkSize = 1000;

const getPlantsWithPosition = async (req: VercelRequest, res: VercelResponse) => {
  const client = createCDAClient();

  const baseQuery: EntriesQueries<PlantEntrySkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'> = {
    content_type: 'plant',
    limit: chunkSize,
    'fields.position[exists]': true
  };

  const entryCollection = await client.withoutUnresolvableLinks.getEntries<PlantEntrySkeleton, 'fr'>(baseQuery);

  const nbCalls = Math.ceil(entryCollection.total / chunkSize) - 1;

  for (let i = 1; i <= nbCalls; i++) {
    const chunkCollection = await client.withoutUnresolvableLinks.getEntries<PlantEntrySkeleton, 'fr'>({
      ...baseQuery,
      skip: i * chunkSize
    });

    entryCollection.items = entryCollection.items.concat(chunkCollection.items);
  }

  res.status(200).send(JSON.stringify(entryCollectionToPaginatedResult(entryCollection, entryToPlant)));
};

export default withCors(getPlantsWithPosition);
