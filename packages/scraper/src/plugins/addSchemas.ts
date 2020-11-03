import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import * as song from 'schemas/song';

const addSchemasPlugin: FastifyPluginCallback = (fastify, opts, next) => {
  song.addSchemas(fastify);

  next();
};

export default fp(addSchemasPlugin, {
  name: 'add-schemas',
});
