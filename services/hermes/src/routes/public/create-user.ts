import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UNKNOWN_ERROR_REASON, USER_ALREADY_EXISTS_REASON } from "src/constants/errors.js";
import { z } from "zod";

export function createUser(server: FastifyInstance) {
  return server.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/v1/auth/user',
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      }),
      response: {
        201: z.object({
          entity: z.object({
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              firstName: z.string(),
              lastName: z.string(),
            }),
          }),
        }),
        409: z.object({
          error: z.object({
            message: z.string().optional(),
            reason: z.literal(USER_ALREADY_EXISTS_REASON),
          }),
        }),
        400: z.object({
          error: z.object({
            message: z.string().optional(),
            reason: z.literal(UNKNOWN_ERROR_REASON),
          })
        }),
      }
    },
    async handler(request, reply) {
      const { email, password, firstName, lastName } = request.body;

      const { error } = await server.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        server.log.error(error);
        return reply.status(400).send({ error: { reason: UNKNOWN_ERROR_REASON, message: error.message } });
      }

      const user = await server.prisma.user.create({
        data: {
          email: email,
          firstName,
          lastName,
        }
      }).catch((error) => {
        server.log.error(error);
        return reply.status(409).send({ error: { reason: USER_ALREADY_EXISTS_REASON } });
      });


      return reply.status(201).send({ entity: { user } });
    }
  });
}