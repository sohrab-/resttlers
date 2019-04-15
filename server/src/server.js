import fastify from "fastify";
import fastifySensible from "fastify-sensible";

// TODO
import fastifyOpenapi from "@dpe/fastify-openapi";
import { notFoundHandler, defaultErrorHandler } from "./http/error";
import SettlementService from "./service/SettlementService";

/**
 * Configures and starts a Fastify server
 *
 * @param {string} httpPort The HTTP port where the server is listening
 * @param {string} httpBasePath The HTTP base path applied to all resources
 * @param {string} logLevel The log level
 */
export default function startServer(
  game,
  { httpPort, httpBasePath, logLevel }
) {
  const service = new SettlementService(game);

  const server = fastify({
    logger: {
      level: logLevel,
      redact: ["req.headers.authorization"]
    }
  });

  server.register(fastifySensible, { errorHandler: false });

  server.register(fastifyOpenapi, {
    apiSpec: `${__dirname}/../../api.yaml`,
    services: {
      "*": service
    },
    basePath: httpBasePath
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
}
