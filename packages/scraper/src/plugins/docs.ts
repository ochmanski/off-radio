import { FastifyPluginCallback } from 'fastify';
import { FastifyDynamicSwaggerOptions } from 'fastify-swagger';
import fp from 'fastify-plugin';
import { version, description, name } from '../../package.json';

const docsPluginOptions: FastifyDynamicSwaggerOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      version,
      description,
      title: name,
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json', 'text/html'],
    tags: [{ name: 'song', description: 'Song related end-points' }],
    definitions: {},
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header',
      },
    },
  },
};

const docsPlugin: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.register(import('fastify-swagger'), docsPluginOptions);

  next();
};

export default fp(docsPlugin, {
  name: 'docs',
  dependencies: ['add-schemas', 'vendor', 'versioning'],
});
