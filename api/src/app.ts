import fastify, { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import fastifyMongo from 'fastify-mongodb';
import fetcher from './modules/fetcher';

const boot = (opt: { logger?: boolean }): FastifyInstance => {
  const app = fastify(opt);

  app.register(fastifyMongo, {
    forceClose: true,
    url: 'mongodb://localhost:27017/stackoverflow?authSource=admin',
  });

  app.register(fetcher);

  app.route({
    url: '/',
    method: 'GET',
    // Handler: async (): Promise<any> => ({
    //   Message: 'ok',
    // }),
    handler: async (): Promise<any> => await app.getStackOverflowUsers(),
  });

  return app;
};

export default boot;
