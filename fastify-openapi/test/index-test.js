import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import fastifyOpenapi from "../src/index";

chai.use(chaiAsPromised);

describe("fastify-openapi", () => {
  it("works", async () => {
    // setup
    const route = sinon.fake();
    const createSomething = sinon.fake.returns({});
    const getSomething = sinon.fake.returns({});
    const getSomethings = sinon.fake.returns({});
    const next = sinon.fake();
    const service = { createSomething, getSomething, getSomethings };
    const fastify = { route, log: { warn: sinon.fake() } };

    // execute
    await fastifyOpenapi(
      fastify,
      {
        apiSpec: `${__dirname}/api.yaml`,
        services: {
          "*": service
        },
        basePath: "/api/v1"
      },
      next
    );

    // assert
    expect(route.callCount).to.equal(3);
    expect(next.calledOnce);

    const somethingSchema = {
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        name: {
          type: "string"
        }
      }
    };
    const errorSchema = {
      type: "object",
      properties: {
        errorDescription: {
          example: "Resource not found",
          type: "string"
        },
        errorType: {
          example: "BadRequest",
          type: "string"
        }
      }
    };

    // POST /somethings
    expect(route.getCall(0).lastArg).to.deep.equal({
      method: "POST",
      url: "/api/v1/somethings",
      schema: {
        headers: {},
        params: {},
        querystring: {},
        body: somethingSchema,
        response: {
          201: somethingSchema,
          default: errorSchema
        }
      },
      handler: createSomething
    });

    // GET /somethings
    expect(route.getCall(1).lastArg).to.deep.equal({
      method: "GET",
      url: "/api/v1/somethings",
      schema: {
        headers: {},
        params: {},
        querystring: {
          type: "object",
          properties: {
            name: {
              type: "string"
            },
            page: {
              type: "integer",
              default: 1
            },
            pageSize: {
              type: "integer",
              default: 10
            },
            sort: {
              type: "string"
            }
          }
        },
        body: {},
        response: {
          200: {
            type: "object",
            properties: {
              hasNext: {
                type: "boolean"
              },
              items: {
                type: "array",
                items: somethingSchema
              }
            }
          },
          default: errorSchema
        }
      },
      handler: getSomethings
    });

    // GET /somethings/{somethingId}
    expect(route.getCall(2).lastArg).to.deep.equal({
      method: "GET",
      url: "/api/v1/somethings/:somethingId",
      schema: {
        headers: {},
        params: {
          type: "object",
          properties: {
            somethingId: {
              type: "string"
            }
          }
        },
        querystring: {},
        body: {},
        response: {
          200: somethingSchema,
          default: errorSchema
        }
      },
      handler: getSomething
    });
  });

  it("throws exception on missing spec", async () => {
    // setup
    const route = sinon.fake();
    const service = {
      createSomething: sinon.fake()
    };
    const fastify = { route, log: { warn: sinon.fake() } };

    // execute and assert
    expect(
      fastifyOpenapi(
        fastify,
        {
          services: {
            "*": service
          },
          basePath: "/api/v1"
        },
        sinon.fake()
      )
    ).to.be.rejectedWith("No API specification was provided");
  });

  it("throws exception on missing service", async () => {
    // setup
    const route = sinon.fake();
    const fastify = { route, log: { warn: sinon.fake() } };

    // execute and assert
    expect(
      fastifyOpenapi(
        fastify,
        {
          apiSpec: `${__dirname}/api.yaml`,
          basePath: "/api/v1"
        },
        sinon.fake()
      )
    ).to.be.rejectedWith("No services were provided");
  });

  it("doesn't handle TRACE operations", async () => {
    // setup
    const apiSpec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/somethings": {
          post: {
            operationId: "createSomething"
          },
          trace: {
            operationId: "traceSomething"
          }
        }
      }
    };
    const route = sinon.fake();
    const service = {
      createSomething: sinon.fake()
    };
    const fastify = { route, log: { warn: sinon.fake() } };

    // execute
    await fastifyOpenapi(
      fastify,
      {
        apiSpec,
        services: {
          "*": service
        },
        basePath: "/api/v1"
      },
      sinon.fake()
    );

    // assert
    expect(route.callCount).to.equal(1);
    expect(fastify.log.warn.callCount).to.equal(1);
    expect(route.getCall(0).lastArg.method).to.equal("POST");
  });

  it("doesn't support missing operationId", async () => {
    // setup
    const apiSpec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/somethings": {
          post: {
            operationId: "createSomething"
          },
          get: {}
        }
      }
    };
    const route = sinon.fake();
    const service = {
      createSomething: sinon.fake()
    };
    const fastify = { route, log: { warn: sinon.fake() } };

    // execute
    await fastifyOpenapi(
      fastify,
      {
        apiSpec,
        services: {
          "*": service
        },
        basePath: "/api/v1"
      },
      sinon.fake()
    );

    // assert
    expect(route.callCount).to.equal(1);
    expect(fastify.log.warn.callCount).to.equal(1);
    expect(route.getCall(0).lastArg.method).to.equal("POST");
  });

  it("cannot match operation to service determinstically", async () => {
    // setup
    const apiSpec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/somethings": {
          post: {
            operationId: "createSomething",
            tags: ["Something"]
          },
          get: {
            operationId: "getSomethings"
          }
        }
      }
    };
    const route = sinon.fake();
    const service = {
      createSomething: sinon.fake()
    };
    const fastify = { route, log: { warn: sinon.fake() } };

    // execute
    await fastifyOpenapi(
      fastify,
      {
        apiSpec,
        services: {
          Something: service,
          "Another Thing": {}
        },
        basePath: "/api/v1"
      },
      sinon.fake()
    );

    // assert
    expect(route.callCount).to.equal(1);
    expect(fastify.log.warn.callCount).to.equal(1);
    expect(route.getCall(0).lastArg.method).to.equal("POST");
  });

  it("picks the first tag for service", async () => {
    // setup
    const apiSpec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/somethings": {
          post: {
            operationId: "createSomething",
            tags: ["Something", "Another Thing"]
          }
        }
      }
    };
    const route = sinon.fake();
    const createSomething = sinon.fake();
    const service = { createSomething };
    const fastify = { route, log: { warn: sinon.fake() } };

    // execute
    await fastifyOpenapi(
      fastify,
      {
        apiSpec,
        services: {
          Something: service,
          "Another Thing": {}
        },
        basePath: "/api/v1"
      },
      sinon.fake()
    );

    // assert
    expect(route.callCount).to.equal(1);
    expect(fastify.log.warn.callCount).to.equal(1);
    expect(route.getCall(0).lastArg.handler).to.equal(createSomething);
  });

  it("cannot find the operationId in the service", async () => {
    // setup
    const apiSpec = {
      openapi: "3.0.0",
      info: {},
      paths: {
        "/somethings": {
          post: {
            operationId: "createSomething"
          },
          get: {
            operationId: "nonExistentOperation"
          }
        }
      }
    };
    const route = sinon.fake();
    const createSomething = sinon.fake();
    const service = { createSomething };
    const fastify = { route, log: { warn: sinon.fake() } };

    // execute
    await fastifyOpenapi(
      fastify,
      {
        apiSpec,
        services: {
          "*": service
        },
        basePath: "/api/v1"
      },
      sinon.fake()
    );

    // assert
    expect(route.callCount).to.equal(1);
    expect(fastify.log.warn.callCount).to.equal(1);
    expect(route.getCall(0).lastArg.method).to.equal("POST");
  });
});
