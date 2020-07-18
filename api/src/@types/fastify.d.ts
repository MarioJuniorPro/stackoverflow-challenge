import 'fastify';

declare module 'fastify' {
  export interface FastifyInstance {
    getStackOverflowUsers(): any;
  }
}
