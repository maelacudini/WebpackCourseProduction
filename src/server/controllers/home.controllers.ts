import { FastifyReply, FastifyRequest } from "fastify";

const getHomepage  = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply.sendFile('/home.html');
  } catch (error) {
    return reply.status(500).send(error);
  }
};

export {
  getHomepage
};