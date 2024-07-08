import fastify from 'fastify';
import prismaPlugin from './plugins/prisma.js';
import { supabasePlugin } from './plugins/supabase.js';
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { privateRoutes } from './routes/private/index.js';
import { publicRoutes } from './routes/public/index.js';

export const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      }
    }
  }
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

await server
  .register(prismaPlugin)
  .register(supabasePlugin)
  .register(publicRoutes)
  .register(privateRoutes);

