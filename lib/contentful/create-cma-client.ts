import { createClient } from 'contentful-management';

const createCMAClient = () => {
  return createClient({
    accessToken: process.env.TREEVIEWER_CMA_ACCESS_TOKEN ?? ''
  }, { 
    type: 'plain', 
    defaults: {
      spaceId: process.env.TREEVIEWER_CMA_SPACE ?? '',
      environmentId: process.env.TREEVIEWER_CMA_ENVIRONMENT ?? '',
    }
  });
}

export default createCMAClient;
