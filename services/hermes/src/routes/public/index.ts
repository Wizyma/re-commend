import { FastifyInstance } from "fastify";
import { createUser } from "./create-user.js";

export const publicRoutes = (server: FastifyInstance, _opts: unknown, done: () => void) => {
  createUser(server);
  done();
};