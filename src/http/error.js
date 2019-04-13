/**
 * Handles not found errors in fastify
 * @param {Object} error Error obj
 * @param {Object} request Fastify request
 * @param {Object} reply Fastify reply
 */
export function notFoundHandler(error, request, reply) {
  reply.send({
    errorType: "ResourceNotFoundError",
    errorDescription:
      error && error.type && error.message
        ? `${error.type}: ${error.message}`
        : "Resource not found"
  });
}

/**
 * Handles bad request errors in fastify
 * @param {Object} error Error obj
 * @param {Object} request Fastify request
 * @param {Object} reply Fastify reply
 */
export function badRequestHandler(error, request, reply) {
  reply.send({
    errorType: "BadRequestError",
    errorDescription:
      error && error.type && error.message
        ? `${error.type}: ${error.message}`
        : "Bad request."
  });
}

/**
 * Handles any errors that are not caught.
 *
 * It logs the error and transform the error response.
 *
 * @param {Object} error Fastify error
 * @param {Object} request Fastify request
 * @param {Object} reply Fastify response
 */
export function defaultErrorHandler(error, request, reply) {
  const { res } = reply;

  // log the error
  if (res.statusCode >= 500) {
    res.log.error(
      { req: reply.request.raw, res, err: error },
      error && error.message
    );
  } else if (res.statusCode >= 400) {
    res.log.info({ res, err: error }, error && error.message);
  }

  // build error response
  if (res.statusCode === 400) {
    badRequestHandler(error, request, reply);
    return;
  }

  // build error response
  if (res.statusCode === 404) {
    notFoundHandler(error, request, reply);
    return;
  }

  const errorType = error && error.type ? error.type : "InternalServerError";
  const errorDescription =
    (error && error.message && error.type && res.statusCode) !== 500
      ? `${error.type}: ${error.message}`
      : "An unexpected error has occurred";
  reply.send({ errorType, errorDescription });
}
