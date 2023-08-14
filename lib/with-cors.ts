import { VercelRequest, VercelResponse } from '@vercel/node'


const withCors = <T>(handler: (req: VercelRequest, res: VercelResponse) => Promise<T>) => async (req: VercelRequest, res: VercelResponse) => {
  const allowedOrigins = (process.env.TREEVIEWER_ALLOWED_ORIGINS ?? '').split(',');
  const origin = allowedOrigins.find(o => req.headers.origin === o);

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin ?? '');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return await handler(req, res);
}

export default withCors;
