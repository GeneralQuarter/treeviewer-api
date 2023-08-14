import { VercelRequest, VercelResponse } from '@vercel/node'

const withBasicAuth = <T>(handler: (req: VercelRequest, res: VercelResponse) => Promise<T>) => async (req: VercelRequest, res: VercelResponse) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Basic ')) {
    res.status(401).end();
    return;
  }

  const expectedUsername = process.env.TREEVIEWER_USERNAME;
  const expectedPassword = process.env.TREEVIEWER_PASSWORD;

  const decoded = Buffer.from(authorization.slice(6), 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');

  if (expectedUsername !== username || expectedPassword !== password) {
    res.status(401).end();
    return;
  }

  return await handler(req, res);
}

export default withBasicAuth;
