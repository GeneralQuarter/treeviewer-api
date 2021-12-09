import { VercelRequest, VercelResponse } from '@vercel/node';
import createCDAClient from '../lib/contentful/create-cda-client';
import { entryCollectionToPaginatedResult } from '../lib/contentful/entry-collection-to-paginated-result';
import { entryToPlant } from '../lib/contentful/entry-to-plant';
import { PlantFields } from '../lib/contentful/plant-entry';
import withCors from '../lib/with-cors';

const getPlantsWithPosition = async (req: VercelRequest, res: VercelResponse) => {
  const client = createCDAClient();

  const entryCollection = await client.getEntries<PlantFields>({
    content_type: 'plant',
    limit: 1000,
    'fields.position[exists]': true,
  });

  res.status(200).send(JSON.stringify(entryCollectionToPaginatedResult(entryCollection, entryToPlant)));
};

export default withCors(getPlantsWithPosition);