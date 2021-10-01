import { IncomingMessage } from 'http';
import asyncTrigger from './asyncTrigger';
import waitFor from '../tools/waitFor';
import { SimpleResponse } from '../types';

export default async (request: IncomingMessage): Promise<SimpleResponse> => {
  const requestAsync = await asyncTrigger(request);
  const requestObj = JSON.parse(requestAsync.body);
  return waitFor(requestObj.requestId);
};
