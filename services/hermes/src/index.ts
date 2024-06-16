import fastify from 'fastify';
import prismaPlugin from './plugins/prisma.js';

const server = fastify();
await server.register(prismaPlugin);

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
