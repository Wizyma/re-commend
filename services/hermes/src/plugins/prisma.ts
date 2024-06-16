import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  server.log.info('Connecting to Prisma database...');
  const prisma = new PrismaClient({
    log: ['error', 'warn']
  });

  await prisma.$connect();
  // Make Prisma Client available through the fastify server instance: server.prisma
  server.decorate('prisma', prisma);

  server.addHook('onClose', async (server) => {
    server.log.info('Disconnecting from Prisma database...');
    await server.prisma.$disconnect();
  });
});

export default prismaPlugin;
