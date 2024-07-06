import { FastifyInstance } from "fastify";
import { USER_NOT_AUTHORIZED_REASON, USER_NOT_FOUND_REASON } from "src/constants/errors.js";
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
        401: z.object({
          error: z.object({
            message: z.string().optional(),
            reason: z.literal(USER_NOT_AUTHORIZED_REASON)
          }),
        }),
        404: z.object({
          error: z.object({
            message: z.string().optional(),
            reason: z.literal(USER_NOT_FOUND_REASON)
          }),
        }),
        403: z.object({
          error: z.object({
            message: z.string().optional(),
            reason: z.literal(USER_NOT_AUTHORIZED_REASON)
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
        return reply.status(404).send({
          error: {
            reason: 'USER_NOT_FOUND',
          },
        });
      }

      if (user.id !== request.user.id) {
        server.log.error(`User ${request.user.id} is not authorized to view user ${user.id}`);

        return reply.status(403).send({
          error: {
            reason: USER_NOT_AUTHORIZED_REASON,
            message: 'User is not authorized to view this user',
          },
        });
      }

      return reply.status(200).send({ entity: { user } });
    },
  });
}