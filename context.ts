// context.ts
import { PrismaClient } from '@prisma/client'
import { GraphQLRequest, GraphQLResponse, Logger } from 'apollo-server-types';
export type Context = {
  db: PrismaClient,
  request: GraphQLRequest,
  response: GraphQLResponse,
  log: Logger,
}
export const db = new PrismaClient();