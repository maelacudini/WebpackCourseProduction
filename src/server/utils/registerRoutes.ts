import { FastifyInstance } from "fastify";
import { routes } from "../routes/home.routes";

export const registerRoutes = async ( fastify: FastifyInstance ) => {
  await fastify.register(routes);
};