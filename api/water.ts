import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { PlainClientAPI } from 'contentful-management';
import createCMAClient from '../lib/contentful/create-cma-client';
import withBasicAuth from '../lib/with-basic-auth';
import withCors from '../lib/with-cors';

const postWater = async (req: VercelRequest, res: VercelResponse) => {
  const potentialIds = req.body as string[];

  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  if (
    !Array.isArray(potentialIds) ||
    potentialIds.some((el) => typeof el !== 'string')
  ) {
    res.status(400).end();
    return;
  }

  const entryIds = [...new Set(potentialIds)];
  const client = createCMAClient();

  await Promise.all(entryIds.map((entryId) => waterEntry(client, entryId)));

  res.status(204).end();
};

async function waterEntry(client: PlainClientAPI, entryId: string) {
  try {
    const entry = await client.entry.get({ entryId });
    const wateredAt = new Date().toISOString();
    const updatedEntry = await client.entry.patch(
      { entryId, version: entry.sys.version },
      [
        {
          op: entry.fields.wateredAt ? 'replace' : 'add',
          path: entry.fields.wateredAt
            ? '/fields/wateredAt/fr'
            : '/fields/wateredAt',
          value: entry.fields.wateredAt ? wateredAt : { fr: wateredAt },
        },
      ],
    );
    return client.entry.publish({ entryId }, updatedEntry);
  } catch (e) {
    console.log(e);
  }
}

export default withCors(withBasicAuth(postWater));
