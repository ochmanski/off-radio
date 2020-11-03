import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const vendorPlugin: FastifyPluginCallback = (fastify, opts, next) => {
  // https://github.com/fastify/fastify-swagger#integration
  fastify.register(import('fastify-helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  fastify.register(import('fastify-cors'));

  next();
};

export default fp(vendorPlugin, {
  name: 'vendor',
});
