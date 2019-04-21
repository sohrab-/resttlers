const ERROR_TYPES = {
  400: "BadRequest",
  403: "Forbidden",
  404: "NotFound",
  500: "InternalServerError"
};

/**
 * Handles not found errors in fastify
 * @param {Object} request Fastify request
 * @param {Object} reply Fastify reply
 */
export function notFoundHandler(request, reply) {
  reply.send({
    errorType: ERROR_TYPES[400],
    errorDescription: "Resource not found"
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
  const errorType = ERROR_TYPES[res.statusCode] || "InternalServerError";
  const errorDescription =
    res.statusCode < 500 && error && error.message
      ? error.message
      : "An unexpected error has occurred";
  reply.send({ errorType, errorDescription });
}
