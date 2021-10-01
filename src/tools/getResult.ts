import { redis } from 'clockwork-event-sourcing';
import { SimpleResponse } from '../types';
import returnCode from '../handlers/returnCode';

export default async (requestId: string): Promise<SimpleResponse> => {
  if (!requestId) {
    return returnCode(404, 'Not Found')();
  }
  const requestKey = `${process.env.REDIS_PREFIX}-response-${requestId}`;
  const results = await redis.get(requestKey);
  if (results) {
    try {
      const resultsJSON = JSON.parse(results);
      if (resultsJSON.output?.statusCode !== 202) {
        redis.del(requestKey);
      }
      return resultsJSON.output as SimpleResponse;
    } catch (e) {
      console.error('Get Result', requestId, e);
      return returnCode(500, 'Internal Server Error')();
    }
  }
  return returnCode(410, 'Gone')();
};
