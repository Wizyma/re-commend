import { PrismaClient } from '@prisma/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
  if (!process.env.DATABASE_TEST) {
    mockReset(prisma);
  }
});

export const prisma = process.env.DATABASE_TEST ? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: ['query', 'info', 'warn', 'error']
}) : mockDeep<PrismaClient>();


