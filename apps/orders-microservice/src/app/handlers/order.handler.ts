import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from "fastify"

export const orderStateHandler = (server: FastifyInstance, error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error.message === 'OPERATION_NOT_ALLOWED') {
    reply.code(409).send({ data: 'OPERATION_NOT_ALLOWED' })
    return
  }
}
