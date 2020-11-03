import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const registerRoutesPlugin: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.register(import('routes/index'));
  fastify.register(import('routes/songs/latest'), { prefix: 'api' });

  next();
};

export default fp(registerRoutesPlugin, {
  name: 'register-routes',
  dependencies: ['vendor', 'add-schemas', 'static', 'versioning'],
});
