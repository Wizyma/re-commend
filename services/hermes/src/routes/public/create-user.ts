import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
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
        403: z.object({
          entity: z.object({
            error: z.string(),
          }),
        }),
        400: z.object({
          entity: z.object({
            error: z.string(),
          }),
        }),
      }
    },
    async handler(request, reply) {
      const { email, password, firstName, lastName } = request.body;

      const { data, error } = await server.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        server.log.error(error);
        return reply.status(400).send({ entity: { error: JSON.stringify(error) } });
      }

      if (!data.user) {
        return reply.status(400).send({ entity: { error: 'User was not created' } });
      }

      const user = await server.prisma.user.create({
        data: {
          email: email,
          firstName,
          lastName,
        }
      });

      return reply.status(201).send({ entity: { user } });
    }
  });
}