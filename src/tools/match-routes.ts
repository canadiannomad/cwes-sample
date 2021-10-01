import { IncomingMessage } from 'http';
import { URL } from 'url';
import { Route, SimpleResponse } from '../types';
// Run through all routes, first one to match, run the callback, otherwise return null.
//
export default async (request: IncomingMessage, routes: Route[]): Promise<null | SimpleResponse> => {
  const url = request.url || '';
  const parsedUrl = new URL(url, `https://${request.headers.host}`);
  for (const rte of routes) {
    if (rte[0].test(parsedUrl.pathname)) {
      return rte[1](request);
    }
  }
  return null;
};
