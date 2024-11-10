import type { VercelRequest, VercelResponse } from '@vercel/node';
import withCors from '../../lib/with-cors';
import withBasicAuth from '../../lib/with-basic-auth';
import createCMAClient from '../../lib/contentful/create-cma-client';
import type { PlainClientAPI } from 'contentful-management';

const postDeadPlant = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'DELETE') {
    res.status(405).end();
    return;
  }
  
  const { plantId } = req.query;

  if (typeof plantId !== 'string') {
    res.status(400).end();
    return;
  }

  const client = createCMAClient();

  await markPlantAsDead(client, plantId);

  res.status(204).end();
}

async function markPlantAsDead(client: PlainClientAPI, entryId: string) {
  try {
    const entry = await client.entry.get({ entryId });
    const declaredDeadAt = new Date().toISOString();
    const deadTag = {
      sys: {
        id: 'dead',
        linkType: 'Tag',
        type: 'Link'
      }
    };
    const updatedEntry = await client.entry.patch(
      { entryId, version: entry.sys.version }, 
      [
        {
          op: 'add',
          path: '/metadata/tags/-',
          value: deadTag
        },
        {
          op: entry.fields.declaredDeadAt ? 'replace' : 'add',
          path: entry.fields.declaredDeadAt ? '/fields/declaredDeadAt/fr' : '/fields/declaredDeadAt',
          value: entry.fields.declaredDeadAt ? declaredDeadAt : { fr: declaredDeadAt }
        }
      ]
    );
    return client.entry.publish({ entryId }, updatedEntry);
  } catch (e) {
    console.log(e);
  }
}

export default withCors(withBasicAuth(postDeadPlant));
