/*
 * Set redis to return HTTP response.
 */

import { redis } from 'clockwork-event-sourcing';
import { Request, SimpleResponse } from '../types';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default async (requestId: string, payload: Record<string, any>): Promise<void> => {
  const requestKey = redis.withPrefix(`response-${requestId}`);
  const request = {} as Request;
  const output: SimpleResponse = {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'text/json',
    },
    statusCode: 200,
  };
  request.output = output;
  await redis.set(requestKey, JSON.stringify(request), 'EX', '20');
};
