import { FastifyInstance } from "fastify";
import { getHomepage } from '../controllers/home.controllers';

const routes = async (fastify: FastifyInstance) => {
  fastify.get('/', getHomepage);
};

export { routes };
