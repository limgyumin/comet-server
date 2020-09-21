import { createConnection } from "typeorm";
import "dotenv/config";
import * as http from "http";
import app from "./app";

import scheduler from "./lib/scheduler";

const { PORT } = process.env;

createConnection()
  .then((connection) => {
    console.log("[Typeorm] Successfully connected with mariadb");
  })
  .catch((err) => {
    console.log(err);
  });

scheduler();

http.createServer(app).listen(PORT || 8080, () => {
  console.log(`[HTTP] Server is listening to ${PORT}`);
});
