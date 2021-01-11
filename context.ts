// context.ts
import express from 'express';
import { PrismaClient } from '@prisma/client'
export type Context = {
  db: PrismaClient,
  req: express.Request,
  res: express.Response,
}
export const db = new PrismaClient();