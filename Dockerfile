FROM gcr.io/google_appengine/nodejs
RUN /usr/local/bin/install_node 10.x.x

COPY . /app/

WORKDIR /app/client
RUN \
  npm install --unsafe-perm \
  && npm run build \
  && rm -rf /app/client/node_modules

WORKDIR /app/fastify-openapi
RUN \
  NODE_ENV=development npm install --unsafe-perm \
  && npm run build \
  && rm -rf /app/fastify-openapi/node_modules

WORKDIR /app/server
RUN \
  NODE_ENV=development npm install --unsafe-perm \
  && npm run build \
  && npm prune

CMD ["npm", "run", "serve"]