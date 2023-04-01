import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Errors } from "./errors.enum";

export const permissionHandler = (_server: FastifyInstance, error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
  if (error.message === Errors.PERMISSION_DENIED) {
    reply.code(403).send({ data: Errors.PERMISSION_DENIED })
    return
  }
}

export const entityHandler = (_server: FastifyInstance, error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
  if (error.message === Errors.ORDER_DOES_NOT_EXIST) {
    reply.code(404).send({ data: Errors.ORDER_DOES_NOT_EXIST })
    return
  }
}
