import fs from "fs";
import path from "path";
import fastify from "fastify";
import fastifySensible from "fastify-sensible";

import fastifyOpenapi from "@dpe/fastify-openapi";
import { notFoundHandler, defaultErrorHandler } from "./error";

const BASE_DIR = path.join(__dirname, "..", "..", "..");
const API_SPEC_YAML_PATH = path.join(BASE_DIR, "api.yaml");

/**
 * Configures and starts a Fastify server
 *
 * @param {string} httpPort The HTTP port where the server is listening
 * @param {string} httpBasePath The HTTP base path applied to all resources
 * @param {string} logLevel The log level
 */
export default function httpServer(
  service,
  { httpPort, httpBasePath = "", logLevel }
) {
  const server = fastify({
    logger: {
      level: logLevel,
      redact: ["req.headers.authorization"]
    }
  });

  server.register(fastifySensible, { errorHandler: false });

  // serve API
  server.register(fastifyOpenapi, {
    apiSpec: API_SPEC_YAML_PATH,
    services: {
      "*": service
    },
    basePath: `${httpBasePath}/api`
  });

  server.setNotFoundHandler(notFoundHandler);
  server.setErrorHandler(defaultErrorHandler);

  server.get("/health", { logLevel: "warn" }, async () => "");

  server.listen(httpPort, "0.0.0.0", err => {
    if (err) {
      server.log.error(err.stack);
      process.exit(1);
    }
  });

  return server;
}
