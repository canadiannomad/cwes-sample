import promiseRetry from 'promise-retry';
import getResult from './getResult';
import returnCode from '../handlers/returnCode';
import { SimpleResponse } from '../types';

export default async (requestId: string): Promise<SimpleResponse> => {
  try {
    return promiseRetry(
      {
        randomize: true,
        minTimeout: 100,
        retries: 10,
      },
      async (retry, num: number) => {
        const check = await getResult(requestId);
        if (!check || check.statusCode === 202 || (num < 6 && check.statusCode === 404)) {
          return retry('Not ready.');
        }
        return check;
      },
    );
  } catch (_e) {
    return returnCode(410, 'Gone')();
  }
};
