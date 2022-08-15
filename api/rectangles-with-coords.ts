import { VercelRequest, VercelResponse } from '@vercel/node';
import createCDAClient from '../lib/contentful/create-cda-client';
import { entryCollectionToPaginatedResult } from '../lib/contentful/entry-collection-to-paginated-result';
import { entryToRectangle } from '../lib/contentful/entry-to-rectangle';
import { RectangleFields } from '../lib/contentful/rectangle-entry';
import withCors from '../lib/with-cors';

const getRectanglesWithCoords = async (req: VercelRequest, res: VercelResponse) => {
  const client = createCDAClient();

  const entryCollection = await client.getEntries<RectangleFields>({
    content_type: 'rectangle',
    limit: 1000,
    'fields.coords[exists]': true,
  });

  res.status(200).send(JSON.stringify(entryCollectionToPaginatedResult(entryCollection, entryToRectangle)));
};

export default withCors(getRectanglesWithCoords);