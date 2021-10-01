import { eventqueue, redis, types } from 'clockwork-event-sourcing';
import { IncomingMessage } from 'http';
import { v1 as uuidv1 } from 'uuid';
import returnCode from './returnCode';
import { SimpleResponse, PayloadHTTP } from '../types';

const createStub = async (requestId: string): Promise<void> => {
  const requestKey = `${process.env.REDIS_PREFIX}-response-${requestId}`;
  const request = { output: {} };
  const output: SimpleResponse = {
    body: JSON.stringify({
      success: 'Accepted',
    }),
    headers: {
      'Content-Type': 'text/json',
    },
    statusCode: 202,
  };
  request.output = output;
  redis.set(requestKey, JSON.stringify(request), 'EX', 20);
};

const getFullStream = async (request: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const data: Buffer[] = [];
    let size = 0;
    request.on('error', error => {
      reject(error);
    });
    request.on('data', chunk => {
      size += chunk.length;
      // Max 10mb body
      if (size > 10 * 1024 * 1024) {
        reject(new Error('Data stream too large'));
      }

      data.push(chunk);
    });
    request.on('end', () => {
      resolve(Buffer.concat(data).toString());
    });
  });

export default async (request: IncomingMessage): Promise<SimpleResponse> => {
  const url = request.url || '/';
  const callMatch = url.match(/^\/es\/([0-9]+\.[0-9]+\.[0-9]+)\/.?sync\/(.*$)/);
  if (!callMatch) {
    return returnCode(404, 'Not Found')();
  }

  const requestId = uuidv1();
  const bodyObj = await getFullStream(request);
  const hasBody = !!bodyObj;
  // TODO handle Files
  if (hasBody) {
    const requestKey = `${process.env.REDIS_PREFIX}-request-body-${requestId}`;
    redis.set(requestKey, JSON.stringify(bodyObj), 'EX', 10);
  }

  const call = callMatch[2].replace(/\//g, '_');
  const payload: PayloadHTTP = {
    method: 'GET',
    path: url,
    call,
    validatedToken: null,
    headers: request.headers,
    hasBody,
  };
  const evt: types.Event<PayloadHTTP> = {
    requestId,
    payloadType: 'PayloadHTTP',
    payloadVersion: callMatch[1],
    date: new Date().toJSON(),
    payload,
  };

  createStub(requestId);
  await eventqueue.send(evt);

  const outp: SimpleResponse = {
    statusCode: 201,
    headers: {},
    body: JSON.stringify({ status: 'submitted', requestId }),
  };
  return outp;
};
