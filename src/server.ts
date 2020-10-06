import { createConnection } from "typeorm";
import "dotenv/config";
import * as http from "http";
import app from "./app";

import scheduler from "./lib/scheduler";
import logger from "./lib/logger";

const { PORT } = process.env;

createConnection()
  .then((connection) => {
    logger.gray("DB 연결됨.");
  })
  .catch((err) => {
    console.log(err);
  });

scheduler();

http.createServer(app).listen(PORT || 8080, () => {
  logger.gray(`Server is listening to ${PORT}`);
});
