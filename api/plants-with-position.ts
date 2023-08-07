import { VercelRequest, VercelResponse } from '@vercel/node';
import createCDAClient from '../lib/contentful/create-cda-client';
import { entryCollectionToPaginatedResult } from '../lib/contentful/entry-collection-to-paginated-result';
import { entryToPlant } from '../lib/contentful/entry-to-plant';
import withCors from '../lib/with-cors';
import { PlantEntrySkeleton } from '../lib/contentful/plant-entry';

const getPlantsWithPosition = async (req: VercelRequest, res: VercelResponse) => {
  const client = createCDAClient();

  const entryCollection = await client.withoutUnresolvableLinks.getEntries<PlantEntrySkeleton>({
    content_type: 'plant',
    limit: 1000,
    'fields.position[exists]': true,
    // @ts-ignore
    'metadata.tags.sys.id[nin]': 'dead'
  });

  res.status(200).send(JSON.stringify(entryCollectionToPaginatedResult(entryCollection, entryToPlant)));
};

export default withCors(getPlantsWithPosition);
