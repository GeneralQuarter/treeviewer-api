import { createClient } from 'contentful';

const createCDAClient = () => {
  return createClient({
    accessToken: process.env.TREEVIEWER_CDA_ACCESS_TOKEN ?? '',
    space: process.env.TREEVIEWER_CDA_SPACE ?? '',
  });
};

export default createCDAClient;
