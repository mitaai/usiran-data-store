// context.ts
import express from 'express';
import { PrismaClient } from '@prisma/client'
import * as Floggy from 'floggy'
export type Context = {
  db: PrismaClient,
  req: express.Request,
  res: express.Response,
  log: Floggy.Logger,
}
export const db = new PrismaClient();