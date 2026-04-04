import type { FastifyRequest, FastifyReply } from "fastify"

export function allowroles(...roles: string[]) {
    return async function (req: FastifyRequest, reply: FastifyReply) {
        const user = req.user as { role: string } | undefined

        if (!user || !roles.includes(user.role)) {
            return reply.status(403).send({
                message: "Unauthorized"
            })
        }
    }
}
       