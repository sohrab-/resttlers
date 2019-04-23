OpenAPI 3 Plugin for Fastify
===

This plugin configures a Fastify server with routes from an OpenAPI 3.x specification. The configuration includes parameter and payload schema validation and service operation routing.

Usage
---

```javascript
import fastifyOpenapi from "@dpe/fastify-openapi";

fastify.register(fastifyOpenapi, {
  apiSpec: `/path/to/api.yaml`,
  services: {
    "Some Tag": someService,
    "Another Tag": anotherService
  },
  basePath: "/api/v1"
});
```

* `apiSpec`: An object, file path or URL containing an OpenAPI 3.x specification
* `basePath`: HTTP path to be prepended to all paths in the specification
* `services`: A mapping of tags in the specification to a service object implementing the API

The plugin will configure match the operations in the specification based their `operationId` and also `tags` (if more than one service has been supplied). For example, `tag: [ "Some Tag" ]` and `operationId: createThing` will match `someService.createThing(request, reply)` method, given the above configuration.

Develop
---

Ensure all checks pass before pushing the code:

```
npm run check
```

Publish the NPM package:

```
npm run build
npm publish
```

