/* eslint-disable no-console */

import 'reflect-metadata';
import { createConnection, getConnectionOptions, Connection } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import models from '../models';

let connection: Connection;

export default async (): Promise<Connection> => {
  if (connection) return connection;

  await createDatabase({ ifNotExist: true });
  const baseConnectionOpts = await getConnectionOptions();
  connection = await createConnection({
    ...baseConnectionOpts,
    entities: Object.values(models),
  });
  await connection.synchronize();
  return connection;
};
