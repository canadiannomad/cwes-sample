import { IncomingMessage, ServerResponse } from 'http';
import * as handlers from './handlers';
import matchRoutes from './tools/match-routes';
import { Route } from './types';

if (!process.env.DATALAKE_BUCKET || !process.env.REDIS_HOST || !process.env.REDIS_PREFIX) {
  throw new Error('Environment variables not set. Please check DATALAKE_BUCKET, REDIS_HOST, REDIS_PREFIX');
}

// Create HTTP Listener
export default async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  // /api/{1.0.0}/async/{service}/{action} -> Trigger event, return UUID
  // /api/{1.0.0}/sync/{service}/{action} -> Trigger event, return results or timeout.
  // /api/result/{uuidv1} -> return 200 with result, "202 Accepted" if still waiting, "410 Gone" if already retrieved or timeout
  // anything else, send direct to legacy.
  //

  const routes: Route[] = [
    [/^\/es\/[0-9]+\.[0-9]+\.[0-9]+\/async\/.*$/, handlers.asyncTrigger],
    [/^\/es\/[0-9]+\.[0-9]+\.[0-9]+\/sync\/.*$/, handlers.syncTrigger],
    [
      /^\/es\/result\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
      handlers.returnResult,
    ],
    //    [/^.*$/, handlers.proxyLegacy],
  ];
  let matchResponse = await matchRoutes(request, routes);
  const defaultHeaders = { 'content-type': 'application/json' };
  let headers: Record<string, string> = defaultHeaders;
  if (!matchResponse) {
    console.warn('Route not found', request.url, matchResponse);
    matchResponse = await handlers.returnCode(404, 'Not Found')(request);
  }

  headers = matchResponse.headers ? { ...defaultHeaders, ...matchResponse.headers } : defaultHeaders;
  headers['content-length'] = matchResponse.body.length.toString();
  response.writeHead(matchResponse.statusCode, headers);
  response.end(matchResponse.body);
};
