/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage, OutgoingHttpHeaders } from 'http';

export interface PayloadHTTP {
  method: string;
  path: string;
  call: string;
  validatedToken: Record<string, any> | null;
  headers: OutgoingHttpHeaders;
  hasBody: boolean;
}

export type RequestObject = Record<string, any>;

export interface Request {
  output: RequestObject;
}

export interface SimpleResponse {
  headers: OutgoingHttpHeaders;
  statusCode: number;
  body: string;
}

export type RequestCallback = (request: IncomingMessage) => Promise<null | SimpleResponse>;

export type Route = [RegExp, RequestCallback];

export enum MTurkQuestionType {
  text = 'TEXT',
  longtext = 'LONGTEXT',
  multipleChoice = 'MULTIPLECHOICE',
}
export enum MTurkHitStage {
  collect = 'COLLECT',
  vote = 'VOTE',
}

export interface MTurkQuestion {
  text: string;
  type: MTurkQuestionType;
  choices?: string[];
  default?: number;
}

export interface PayloadTelegramInput {
  tgUserId: string;
  tgAlias: string;
  text: string;
}
export interface PayloadMTurkHit {
  hitId: string;
  stage: MTurkHitStage;
  quorum: number;
  questions: MTurkQuestion[];
}
export interface PayloadMTurkAssignment {
  hitId: string;
  assignmentId: string;
  workerId: string;
  stage: MTurkHitStage;
  quorum: number;
  tgUserId: string;
  response: string;
}
export interface PayloadTelegramOutput {
  tgUserId: string;
  output: string;
}
