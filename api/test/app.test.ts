import tap from 'tap';
import boot from '../src/app';

tap.test('Receive application instance', async () => {
  const app = boot({});

  tap.tearDown((): any => app.close());

  tap.type(app, 'object');
});

tap.test('Respond to GET at /', async () => {
  const app = boot({});

  tap.tearDown((): any => app.close());

  app.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err, response) => {
      tap.error(err);
      tap.strictEqual(response.statusCode, 200);
      tap.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
      tap.deepEqual(response.json(), { message: 'ok' });
    },
  );
});
