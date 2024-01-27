import { config } from "./lib";
import router from "./routes";

import { callUsersCron, createServer, log, updatePriorityCron } from "./utils";

const port = config.get("port") as number;

const main = async () => {
  const app = await createServer();

  app.use("/api", router);

  updatePriorityCron.start();
  callUsersCron.start();

  app.listen(port, () => {
    log.info(`Server is listening on url http://localhost:${port}`);
  });
};

main();
