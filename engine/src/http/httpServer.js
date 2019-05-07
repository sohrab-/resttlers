import fastify from "fastify";

export default function httpServer(
  game,
  { httpPort, httpBasePath = "", logLevel }
) {
  const server = fastify({
    logger: {
      level: logLevel,
      redact: ["req.headers.authorization"]
    }
  });

  // endpoints for events
  server.post(`${httpBasePath}/settlements/:id`, async (request, reply) => {
    await game.upsertSettlement(request.params.id);
    reply.code(204).send();
  });

  server.delete(`${httpBasePath}/settlements/:id`, async (request, reply) => {
    await game.deleteSettlement(request.params.id);
    reply.code(204).send();
  });

  server.get("/health", { logLevel: "warn" }, async () => "");

  server.listen(httpPort, "0.0.0.0", err => {
    if (err) {
      server.log.error(err.stack);
      process.exit(1);
    }
  });

  return server;
}
