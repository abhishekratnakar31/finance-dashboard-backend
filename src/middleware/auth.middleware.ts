import type { FastifyRequest, FastifyReply } from "fastify"

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify()
    } catch (err: any) {
        reply.status(401).send({
            message: "unauthorized",
            reason: err.message
        })
    }
}