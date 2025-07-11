import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { PlainClientAPI } from 'contentful-management';
import createCMAClient from '../../lib/contentful/create-cma-client';
import withBasicAuth from '../../lib/with-basic-auth';
import withCors from '../../lib/with-cors';

const allowedMethods = ['DELETE', 'PATCH'];

const plantAction = async (req: VercelRequest, res: VercelResponse) => {
  const method = req.method;

  if (!method || !allowedMethods.includes(method)) {
    res.status(405).end();
    return;
  }

  const { plantId } = req.query;

  if (typeof plantId !== 'string') {
    res.status(400).end();
    return;
  }

  const client = createCMAClient();

  switch (method) {
    case 'DELETE':
      await updatePlantDateField(client, plantId, 'dead', 'declaredDeadAt');
      break;
    case 'PATCH':
      await updatePlantDateField(client, plantId, 'planted', 'plantedAt');
      break;
  }

  res.status(204).end();
};

async function updatePlantDateField(
  client: PlainClientAPI,
  entryId: string,
  tagId: string,
  dateField: string,
) {
  try {
    const entry = await client.entry.get({ entryId });
    const dateAt = new Date().toISOString();
    const tag = {
      sys: {
        id: tagId,
        linkType: 'Tag',
        type: 'Link',
      },
    };
    const updatedEntry = await client.entry.patch(
      { entryId, version: entry.sys.version },
      [
        {
          op: 'add',
          path: '/metadata/tags/-',
          value: tag,
        },
        {
          op: entry.fields[dateField] ? 'replace' : 'add',
          path: entry.fields[dateField]
            ? `/fields/${dateField}/fr`
            : `/fields/${dateField}`,
          value: entry.fields[dateField] ? dateAt : { fr: dateAt },
        },
      ],
    );
    return client.entry.publish({ entryId }, updatedEntry);
  } catch (e) {
    console.log(e);
  }
}

export default withCors(withBasicAuth(plantAction));
