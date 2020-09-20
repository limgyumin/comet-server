import { createConnection } from "typeorm";
import "dotenv/config";
import * as http from "http";
import app from "./app";

const { PORT } = process.env;

createConnection()
  .then((connection) => {
    console.log("[Typeorm] Successfully connected with mariadb");
  })
  .catch((err) => {
    console.log(err);
  });

http.createServer(app).listen(PORT || 8080, () => {
  console.log(`[HTTP] Server is listening to ${PORT}`);
});
