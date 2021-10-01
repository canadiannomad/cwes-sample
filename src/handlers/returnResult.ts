import { IncomingMessage } from 'http';
import getResult from '../tools/getResult';
import { SimpleResponse } from '../types';
import returnCode from './returnCode';

export default async (request: IncomingMessage): Promise<SimpleResponse> => {
  if (!request.url) {
    return returnCode(404, 'Not Found')(request);
  }
  const urlMatches = request.url.match(
    /\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/,
  );
  if (!urlMatches) {
    console.warn('Return Result Match Failed', request.url);
    return returnCode(404, 'Not Found')(request);
  }
  try {
    const requestId: string = urlMatches[1];
    return getResult(requestId);
  } catch (e) {
    console.error(request.url, e);
    return returnCode(500, 'Internal Server Error')();
  }
};
