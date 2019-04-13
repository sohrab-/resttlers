import startServer from "./server";

// app config
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const HTTP_PORT = process.env.HTTP_PORT || "8085";
const HTTP_BASE_PATH = process.env.HTTP_BASE_PATH || "/api";

// start server
startServer({
  httpPort: HTTP_PORT,
  httpBasePath: HTTP_BASE_PATH,
  logLevel: LOG_LEVEL
});
