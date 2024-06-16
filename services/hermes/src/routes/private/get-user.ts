import { FastifyInstance } from "fastify";
import { z } from "zod";

export function getUser(server: FastifyInstance) {
  return server.withTypeProvider().route({
    method: 'GET',
    url: '/v1/auth/user/:id',
    schema: {
      querystring: z.object({
        id: z.string().cuid(),
      }),
      headers: z.object({
        Authorization: z.string().min(1).regex(/^Bearer .+$/),
      }),
      response: {
        200: z.object({
          entity: z.object({
            user: z.object({
              id: z.string(),
              email: z.string().email(),
              firstName: z.string(),
              lastName: z.string(),
              updatedAt: z.string(),
              createdAt: z.string(),
            }),
          }),
        }),
        404: z.object({
          entity: z.object({
            error: z.string(),
          }),
        }),
      }
    },
    async handler(request, reply) {
      const user = await server.prisma.user.findFirstOrThrow({
        where: {
          id: request.user.id,
        },
      });

      if (!user) {
        return reply.status(404).send({ entity: { error: 'User not found' } });
      }

      return reply.status(200).send({ entity: { user } });
    },
  });
}