export const logHttpError = (backend, logger) => e => {
  if (e.response) {
    logger.error(
      `HTTP ${e.response.status} response from ${backend}: ${JSON.stringify(
        e.response.data
      )}`
    );
  } else if (e.request) {
    logger.error("No HTTP response from ${backend}");
  } else {
    logger.error(`Unexpected error when invoking ${backend}: ${e.message}`);
  }
};
