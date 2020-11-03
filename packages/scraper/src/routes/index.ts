import { FastifyPluginCallback } from 'fastify';

const route: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.api.route({
    method: 'GET',
    url: '/',
    handler: (req, rep) => {
      rep
        .header('Content-Type', 'text/html; charset=utf-8')
        .sendFile('index.html');
    },
  });

  next();
};

export default route;
