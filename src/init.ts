import { createServer } from 'http';
import * as cw from 'clockwork-event-sourcing';
import handler from './handler';
import db from './lib/db';
import events from './events';
import models from './models';

const port = 3000;

const init = async () => {
  if (!process.env.DATALAKE_BUCKET || !process.env.REDIS_HOST || !process.env.REDIS_PREFIX) {
    throw new Error('Environment variables not set. Please check DATALAKE_BUCKET, REDIS_HOST, REDIS_PREFIX');
  }

  const connection = await db();
  const options: cw.types.Options = {
    events,
    datalake: {
      s3: {
        bucket: process.env.DATALAKE_BUCKET,
        path: 'events',
      },
    },
    streams: {
      redis: {
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
        tls: false,
        clusterNodes: [
          {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
          },
        ],
        prefix: process.env.REDIS_PREFIX,
      },
    },
    state: {
      getCurrentEventRecordName: async () => (await connection.manager.findOne(models.State, 1))?.position || '',
      setCurrentEventRecordName: async (name: string) => {
        const state = new models.State();
        state.id = 1;
        state.position = name;
        await connection.manager.save(state);
      },
    },
  };
  cw.config.set(options);

  await cw.eventqueue.initializeQueues();
  await cw.eventqueue.syncState();
  await cw.eventqueue.subscribeToQueues();
  // Create HTTP Listener
  const server = createServer(handler);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`); // eslint-disable-line no-console
  });
};

init();
