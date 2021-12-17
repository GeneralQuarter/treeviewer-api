import { VercelRequest, VercelResponse } from '@vercel/node';
import createCDAClient from '../lib/contentful/create-cda-client';
import withCors from '../lib/with-cors';

const getTags = async (req: VercelRequest, res: VercelResponse) => {
  const client = createCDAClient();

  const tagCollection = await client.getTags({
    limit: 1000
  });

  const tags = tagCollection.items.reduce((acc, tagEntry) => {
    acc[tagEntry.sys.id] = tagEntry.name;
    return acc;
  }, {} as {[tagId: string]: string});

  res.status(200).send(JSON.stringify(tags));
};

export default withCors(getTags);