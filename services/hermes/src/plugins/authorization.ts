import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { supabase } from '../clients/supabase.js';
import { USER_NOT_AUTHORIZED_REASON } from 'src/constants/errors.js';

export const authorizationPlugin: FastifyPluginAsync = fp(async (server) => {
  server.addHook('onRequest', async (request, reply) => {
    const token = request.headers['authorization'];

    if (!token) {
      server.log.error('Authorization header not provided');

      if (!token) {
        return reply.code(401).send({
          error: {
            reason: USER_NOT_AUTHORIZED_REASON,
            message: "Authorization header not provided"
          }
        });
      }
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      server.log.error(error);

      return reply.code(401).send({
        error: {
          reason: USER_NOT_AUTHORIZED_REASON,
          message: error.message
        }
      });
    }

    return request.user = data.user;
  });

  return Promise.resolve();
});
