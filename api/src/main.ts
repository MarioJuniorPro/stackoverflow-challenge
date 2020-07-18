import boot from './app';

const bootstrap = async (): Promise<void> => {
  const app = boot({ logger: true });
  const PORT = 3000;

  const host = await app.listen(PORT, '0.0.0.0');

  app.log.info(`Running at: ${host}`);
};

bootstrap();
