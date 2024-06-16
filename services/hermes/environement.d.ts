import type { PrismaClient } from '@prisma/client';
import type { User } from '@supabase/supabase-js';
import type { Supabase } from './src/clients/supabase.js';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DIRECT_URL: string;
      SUPABASE_URL: string;
      SUPABASE_API_KEY: string;
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    supabase: Supabase
  }

  interface FastifyRequest {
    user: User
  }
}

export { };