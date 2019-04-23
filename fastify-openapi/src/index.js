import SwaggerParser from "swagger-parser";
import fp from "fastify-plugin";

// Supported by fastify
// E.g. trace is in OpenAPI 3.0 spec but not supported
const SUPPORTED_HTTP_VERBS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch"
];

/**
 * Translates OpenAPI path params (e.g. `/{someParam}`) to Fastify path params (e.g. `/:someParam`)
 *
 * @param {string} path The path from OpenAPI spec
 * @returns {string} Fastify-ready path
 */
function getPath(path) {
  return path.replace(/{(\w+)}/g, ":$1");
}

/**
 * Extracts the payload schema from a request or response definition
 *
 * @param {Object} container OpenAPI 3 "Request Body" or "Response Object"
 * @returns {Object} JSON Schema
 */
function getContentSchema(container) {
  if (!container || !container.content) {
    return null;
  }
  const [, details] = Object.entries(container.content).find(
    ([contentType]) => contentType.indexOf("application/json") === 0
  );
  return details.schema || null;
}

/**
 * Extracts a schema for the given param [type] from the list of [params]
 *
 * @param {Object[]} params The list of OpenAPI parameters
 * @param {string} type OpenAPI 3 param type, typically in `in` field
 */
function getParams(params, type) {
  if (!params || params.length === 0) {
    return {};
  }
  const matchingParams = params.filter(param => param.in === type);
  if (!matchingParams || matchingParams.length === 0) {
    return {};
  }
  return matchingParams.reduce(
    (obj, { name, required, schema }) => {
      // eslint-disable-next-line no-param-reassign
      obj.properties[name] = schema;

      // path defaults to required, other types not
      if (required || type === "path") {
        obj.required.push(name);
      }
      return obj;
    },
    { type: "object", properties: {}, required: [] }
  );
}

/**
 * Fastify plugin to validate and route requests based on an OpenAPI 3 specification.
 *
 * The first element of `tags` is used to determine which service to invoke and
 * `operationId` is used to determine which function to invoke.
 *
 * @param {Object} fastify The fastify server
 * @param {Object|string} apiSpec An OpenAPI object or file path or URL to an OpenAPI 3 specification
 * @param {Object} services A map of tag to service that will handle the requests
 * @param {string} basePath The basepath to prefix all paths in the specification
 * @param {Function} next The next() function for fastify chain
 */
async function fastifyOpenapi(
  fastify,
  { apiSpec, services, basePath = "" },
  next
) {
  if (!apiSpec) {
    throw new Error("No API specification was provided");
  }
  if (!services || services.length === 0) {
    throw new Error("No services were provided");
  }

  // resolve the spec
  const spec = await SwaggerParser.dereference(apiSpec);

  Object.entries(spec.paths).forEach(([path, operations]) => {
    const pathParams = operations.parameters || [];
    Object.entries(operations).forEach(([verb, operation]) => {
      const {
        operationId,
        tags,
        parameters,
        requestBody,
        responses
      } = operation;

      // deal-breakers
      if (verb === "trace") {
        fastify.log.warn(`Fastify does not support TRACE ${path}. Ignoring...`);
        return;
      }
      if (!SUPPORTED_HTTP_VERBS.includes(verb)) {
        return;
      }

      // determine service function mapping
      if (!operationId) {
        fastify.log.warn(
          `No operationId found for ${verb} ${path}. Ignoring...`
        );
        return;
      }

      let service = null;
      if (Object.values(services).length === 1) {
        [service] = Object.values(services);
      } else {
        if (!tags || tags.length < 1) {
          fastify.log.warn(
            `Cannot unambiguously determine the service for ${verb} ${path}. Ignoring...`
          );
          return;
        }

        if (tags && tags.length > 1) {
          fastify.log.warn(
            `Multiple tags detected for ${verb} ${path}. Picking first one...`
          );
        }

        service = services[tags[0]];
      }

      if (!service || !service[operationId]) {
        fastify.log.warn(
          `Cannot find ${operationId} in service (tag: ${JSON.stringify(
            tags
          )}) for ${verb} ${path}. Ignoring...`
        );
        return;
      }
      const handler = (request, reply) =>
        service[operationId].call(service, request, reply); // preserve "this"

      // extract parameters
      const allParams = pathParams.concat(parameters || []);

      if (allParams.find(x => x.in === "cookie")) {
        fastify.log.warn(
          `Cookie parameters are not supported yet for ${verb} ${path}. Ignoring...`
        );
      }

      // determine schemas
      const querystring = getParams(allParams, "query");
      const params = getParams(allParams, "path");
      const headers = getParams(allParams, "header");
      const body = getContentSchema(requestBody) || {};
      const response =
        responses &&
        Object.entries(responses).reduce((obj, [statusCode, details]) => {
          // eslint-disable-next-line no-param-reassign
          const schema = getContentSchema(details);
          if (schema) {
            obj[statusCode] = schema;
          }
          return obj;
        }, {});

      const schema = {
        querystring,
        params,
        headers,
        body,
        response
      };

      // create route
      const route = {
        method: verb.toUpperCase(),
        url: basePath + getPath(path),
        schema,
        handler
      };
      fastify.log.debug("Route to add: ", route);
      fastify.route(route);
    });
  });

  next();
}

module.exports = fp(fastifyOpenapi, {
  name: "fastify-openapi",
  fastify: "2.x"
});
