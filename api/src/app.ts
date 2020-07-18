import fastify, { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

const boot = (opt: { logger?: boolean }): FastifyInstance => {
  const app = fastify(opt);

  app.route({
    url: '/',
    method: 'GET',
    handler: async (): Promise<any> => ({
      message: 'ok',
    }),
  });

  return app;
};

export default boot;
