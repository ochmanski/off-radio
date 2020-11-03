import path from 'path';
import { FastifyPluginCallback } from 'fastify';
import { FastifyStaticOptions } from 'fastify-static';
import fp from 'fastify-plugin';

const staticPluginOptions: FastifyStaticOptions = {
  root: path.join(__dirname, '../../public'),
  prefix: '/public',
  prefixAvoidTrailingSlash: true,
};

const staticPlugin: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.register(import('fastify-static'), staticPluginOptions);

  next();
};

export default fp(staticPlugin, {
  name: 'static',
});
