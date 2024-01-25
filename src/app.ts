import { config } from './lib';

import { createServer, log } from './utils';

const port = config.get('port') as number;

const main = async () => {
  const app = await createServer();

  app.listen(port, () => {
    log.info(`Server is listening on url http://localhost:${port}`);
  });
};

main();
