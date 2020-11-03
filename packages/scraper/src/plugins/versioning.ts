import {
  FastifyInstance as FastifyInstanceWrapper,
  FastifyPluginCallback,
} from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    api: {
      route: FastifyInstanceWrapper['route'];
      version: {
        default: string;
      };
    };
  }
}

const versioning: FastifyPluginCallback = (fastify, opts, next) => {
  const api = {
    version,
    route: (opts: Parameters<typeof fastify.route>['0']) =>
      fastify.route({ ...opts, version: opts.version || version.default }),
  };

  fastify.decorate('api', api);

  fastify.addHook('preHandler', (req, rep, next) => {
    if (!rep.hasHeader('Accept-Version')) {
      rep.header(
        'Accept-Version',
        req.headers['accept-version'] || api.version.default
      );
    }

    next();
  });

  next();
};

export const storage = () => {
  let versions = {};

  return {
    get: (version) => {
      return versions[version] || null;
    },
    set: (version, store) => {
      versions[version] = store;
    },
    del: (version) => {
      delete versions[version];
    },
    empty: () => {
      versions = {};
    },
  };
};

export const deriveVersion = (req) => {
  // Ignore swagger urls
  if (req['url'].includes('/docs/')) {
    return;
  }

  return req['headers']['accept-version'] || version.default;
};

export const version = {
  default: '1.0.0',
};

export default fp(versioning, {
  name: 'versioning',
});
