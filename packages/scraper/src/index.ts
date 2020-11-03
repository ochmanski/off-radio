import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

import Fastify from 'fastify';
import Pino from 'pino';
import autoload from 'fastify-autoload';
import { storage, deriveVersion } from 'plugins/versioning';

const logger = Pino({ level: 'info' });
const fastify = Fastify({
  logger,
  versioning: { storage, deriveVersion },
  ignoreTrailingSlash: true,
});
const routes: string[] = [];

fastify.addHook('onRoute', (routeOptions) => {
  routes.push(routeOptions.url);
});

fastify.register(autoload, {
  dirNameRoutePrefix: false,
  dir: path.join(__dirname, 'plugins'),
});

fastify.ready((error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }

  fastify.log.info('Scraper service is ready.');
  fastify.log.info(routes);
});

fastify.listen(Number(process.env.PORT), (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
