import { IncomingMessage } from 'http';
import { SimpleResponse } from '../types';

type CallBack = (request?: IncomingMessage) => Promise<SimpleResponse>;

export default (statusCode: number, message: string): CallBack => {
  const body = statusCode >= 200 && statusCode < 300 ? { success: message } : { error: message };
  const outp: SimpleResponse = {
    statusCode,
    headers: {},
    body: JSON.stringify(body),
  };

  return async (_request: IncomingMessage | null = null): Promise<SimpleResponse> => outp;
};
