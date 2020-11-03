import type { FastifyInstance } from 'fastify';

const addSchemasFactory = (schemas: unknown[]) => (
  fastify: FastifyInstance
) => {
  schemas.forEach((s) => fastify.addSchema(s));
};

export default addSchemasFactory;
