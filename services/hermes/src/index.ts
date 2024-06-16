import fastify from 'fastify';
import prismaPlugin from './plugins/prisma.js';
import { supabasePlugin } from './plugins/supabase.js';
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { privateRoutes } from './routes/private/index.js';
import { publicRoutes } from './routes/public/index.js';

const server = fastify({
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


server.get('/ping', () => {
  return 'pong\n';
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
