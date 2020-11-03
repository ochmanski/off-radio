import { FastifyPluginCallback } from 'fastify';
import { getLatestSongListSchema } from 'schemas/song';
import testScrape from 'testScrape';

const route: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.api.route({
    method: 'GET',
    url: '/songs/latest',
    schema: getLatestSongListSchema,
    handler: async (req, rep) => {
      rep
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(await testScrape());
    },
  });

  next();
};

export default route;
