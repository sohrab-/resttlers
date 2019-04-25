import fs from "fs";
import path from "path";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import fastifySensible from "fastify-sensible";

import fastifyOpenapi from "@dpe/fastify-openapi";
import { notFoundHandler, defaultErrorHandler } from "./error";
import SettlementService from "../service/SettlementService";

const BASE_DIR = path.join(__dirname, "..", "..", "..");
const API_SPEC_YAML_PATH = path.join(BASE_DIR, "api.yaml");
const apiSpecYaml = fs.readFileSync(API_SPEC_YAML_PATH);
const apiSpecHtml = fs.readFileSync(
  path.join(BASE_DIR, "server", "public", "apidocs.html")
);

/**
 * Configures and starts a Fastify server
 *
 * @param {string} httpPort The HTTP port where the server is listening
 * @param {string} httpBasePath The HTTP base path applied to all resources
 * @param {string} logLevel The log level
 */
export default function httpServer(
  game,
  { httpPort, httpBasePath = "", logLevel }
) {
  const service = new SettlementService(game);

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

  // TODO admin endpoints

  // serve UI
  console.log(path.join(BASE_DIR, "client", "build"));
  console.log(`${httpBasePath}/ui`);
  server.register(fastifyStatic, {
    root: path.join(BASE_DIR, "client", "build"),
    prefix: `${httpBasePath}/ui`,
    redirect: true
  });

  // serve API spec
  server.get(`${httpBasePath}/apidocs`, (request, reply) => {
    reply.type("text/html").send(apiSpecHtml);
  });
  server.get(`${httpBasePath}/apidocs.yaml`, (request, reply) => {
    reply.type("text/yaml").send(apiSpecYaml);
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
