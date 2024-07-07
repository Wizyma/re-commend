import { test as vitest } from 'vitest';
import { prisma } from './mocks/prisma';
import { defaultUserResponse, supabase } from './mocks/supabase';

export const test = vitest.extend({
  prisma,
  supabase,
  defaultUserResponse,
});
