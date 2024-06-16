import { FastifyInstance } from "fastify";
import { authorizationPlugin } from "../../plugins/authorization.js";
import { getUser } from "./get-user.js";

export const privateRoutes = async (server: FastifyInstance) => {
  await server.register(authorizationPlugin);
  getUser(server);
};