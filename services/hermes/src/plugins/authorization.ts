import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { supabase } from '../clients/supabase.js';

export const authorizationPlugin: FastifyPluginAsync = fp(async (server) => {
  server.addHook('onRequest', async (request, reply) => {
    const token = request.headers['authorization'];
    if (!token) {
      return await reply.code(401).send({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      server.log.error(error);
      return await reply.code(401).send({ error: 'Unauthorized' });
    }

    return request.user = data.user;
  });

  return Promise.resolve();
});
