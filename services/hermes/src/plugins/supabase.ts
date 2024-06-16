import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { supabase } from '../clients/supabase.js';

export const supabasePlugin: FastifyPluginAsync = fp(async (server) => {
  server.decorate('supabase', supabase);
  return Promise.resolve();
});
