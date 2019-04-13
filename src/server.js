import fastify from "fastify";
import fastifySensible from "fastify-sensible";

import { notFoundHandler, defaultErrorHandler } from "./http/error";

/**
 * Configures and starts a Fastify server
 *
 * @param {string} httpPort The HTTP port where the server is listening
 * @param {string} httpBasePath The HTTP base path applied to all resources
 * @param {string} logLevel The log level
 */
export default function startServer({ httpPort, httpBasePath, logLevel }) {
  const server = fastify({
    logger: {
      level: logLevel,
      redact: ["req.headers.authorization"]
    }
  });

  server.register(fastifySensible, { errorHandler: false });

  server.setNotFoundHandler(notFoundHandler);
  server.setErrorHandler(defaultErrorHandler);

  server.get("/health", async () => "");

  server.listen(httpPort, "0.0.0.0", err => {
    if (err) {
      server.log.error(err.stack);
      process.exit(1);
    }
  });
}
